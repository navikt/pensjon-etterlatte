package soeknad

import innsendtsoeknad.common.SoeknadType
import org.slf4j.LoggerFactory
import soeknad.Queries.CREATE_HENDELSE
import soeknad.Queries.CREATE_SOEKNAD
import soeknad.Queries.FINN_KLADD
import soeknad.Queries.FINN_SISTE_STATUS
import soeknad.Queries.OPPDATER_SOEKNAD
import soeknad.Queries.OPPDATER_SOEKNAD_META
import soeknad.Queries.SELECT_OLD
import soeknad.Queries.SELECT_OLDEST_UNARCHIVED
import soeknad.Queries.SELECT_OLDEST_UNSENT
import soeknad.Queries.SELECT_RAPPORT
import soeknad.Queries.SELECT_KILDE
import soeknad.Queries.SLETT_ARKIVERTE_SOEKNADER
import soeknad.Queries.SLETT_KLADD
import soeknad.Queries.SLETT_UTGAATTE_KLADDER
import soeknad.Status.ARKIVERINGSFEIL
import soeknad.Status.ARKIVERT
import soeknad.Status.FERDIGSTILT
import soeknad.Status.KONVERTERT
import soeknad.Status.LAGRETKLADD
import soeknad.Status.SENDT
import soeknad.Status.SLETTET
import soeknad.Status.UTGAATT
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.ZoneId
import javax.sql.DataSource

interface SoeknadRepository {
    fun ferdigstillSoeknad(soeknad: UlagretSoeknad): SoeknadID
    fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad
    fun soeknadSendt(id: SoeknadID)
    fun soeknadArkivert(id: SoeknadID, payload: String? = null)
    fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String)
    fun usendteSoeknader(): List<LagretSoeknad>
    fun slettArkiverteSoeknader(): Int
    fun finnKladd(fnr: String, kilde: String): LagretSoeknad?
    fun slettKladd(fnr: String, kilde: String): SoeknadID?
    fun slettOgKonverterKladd(fnr: String, kilde: String): SoeknadID?
    fun slettUtgaatteKladder(): Int
}

interface StatistikkRepository {
    fun eldsteUsendte(): LocalDateTime?
    fun eldsteUarkiverte(): LocalDateTime?
    fun rapport(): Map<Status, Long>
    fun kilder(): Map<String, Long>
    fun ukategorisert(): List<Long>
}

class PostgresSoeknadRepository private constructor(
    private val ds: DataSource
) : SoeknadRepository, StatistikkRepository {

    private val logger = LoggerFactory.getLogger(PostgresSoeknadRepository::class.java)

    companion object {
        fun using(datasource: DataSource): PostgresSoeknadRepository {
            return PostgresSoeknadRepository(datasource)
        }
    }

    private val connection get() = ds.connection

    private val postgresTimeZone = ZoneId.of("UTC")

    override fun ferdigstillSoeknad(soeknad: UlagretSoeknad): SoeknadID {
        return lagreSoeknad(soeknad).id
            .also { id ->
                logger.info("Ferdigstiller søknad med id $id")
                nyStatus(id, FERDIGSTILT)
                oppdaterSoeknadMeta(id, soeknad.type, soeknad.kilde)
            }
    }

    private fun oppdaterSoeknadMeta(id: SoeknadID, type: SoeknadType?, kilde: String?) = connection.use {
        it.prepareStatement(OPPDATER_SOEKNAD_META)
            .apply {
                setString(1, type?.name)
                setString(2, kilde)
                setLong(3, id)
            }
            .executeUpdate()
    }

    private fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        val lagretSoeknad = finnKladd(soeknad.fnr, soeknad.kilde)

        return if (lagretSoeknad == null) {
            logger.info("Søknad finnes ikke i databasen. Oppretter ny søknad.")
            opprettNySoeknad(soeknad)
        } else if (lagretSoeknad.status != null && lagretSoeknad.status != LAGRETKLADD)
            throw Exception("Bruker har allerede en ferdigstilt søknad under behandling")
        else {
            logger.info("Søknad finnes allerede (id=${lagretSoeknad.id}). Oppdaterer søknad med nytt innhold.")
            oppdaterSoeknad(lagretSoeknad, soeknad.payload)
        }
    }

    private fun opprettNySoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        val id = connection.use {
            it.prepareStatement(CREATE_SOEKNAD)
                .apply {
                    setString(1, soeknad.kilde)
                    setString(2, soeknad.fnr)
                    setString(3, soeknad.payload)
                }
                .executeQuery()
                .singleOrNull { getLong(1) }!!
        }

        return LagretSoeknad(id, soeknad.fnr, soeknad.payload)
    }

    private fun oppdaterSoeknad(kladd: LagretSoeknad, nyDataJson: String): LagretSoeknad {
        connection.use {
            it.prepareStatement(OPPDATER_SOEKNAD)
                .apply {
                    setString(1, nyDataJson)
                    setLong(2, kladd.id)
                }
                .executeUpdate()
        }

        return LagretSoeknad(kladd.id, kladd.fnr, nyDataJson)
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        return lagreSoeknad(soeknad).also {
            nyStatus(it.id, LAGRETKLADD)
        }
    }

    override fun soeknadSendt(id: SoeknadID) {
        nyStatus(id, SENDT, """{}""")
    }

    override fun soeknadArkivert(id: SoeknadID, payload: String?) {
        nyStatus(id, ARKIVERT, payload ?: """{}""")
    }

    override fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String) {
        nyStatus(id, ARKIVERINGSFEIL, jsonFeil)
    }

    private fun nyStatus(soeknadId: SoeknadID, status: Status, payload: String = """{}""") {
        connection.use {
            it.prepareStatement(CREATE_HENDELSE)
                .apply {
                    setLong(1, soeknadId)
                    setString(2, status.name)
                    setString(3, payload)
                }
                .execute()
        }
    }

    override fun slettArkiverteSoeknader(): Int = connection.use {
        it.prepareStatement(SLETT_ARKIVERTE_SOEKNADER).executeUpdate()
    }

    override fun slettUtgaatteKladder(): Int {
        val slettedeKladder = connection.use {
            it.prepareStatement(SLETT_UTGAATTE_KLADDER)
                .executeQuery()
                .toList { getLong(1) }
        }

        slettedeKladder.forEach { nyStatus(soeknadId = it, status = UTGAATT) }

        return slettedeKladder.size
    }

    override fun finnKladd(fnr: String, kilde: String): LagretSoeknad? {
        val soeknad = connection.use {
            it.prepareStatement(FINN_KLADD)
                .apply {
                    setString(1, fnr)
                    setString(2, kilde)
                }
                .executeQuery()
                .singleOrNull {
                    LagretSoeknad(getLong("soeknad_id"), fnr, getString("payload"))
                }
        }

        return if (soeknad != null) {
            val sisteStatus = connection.use {
                it.prepareStatement(FINN_SISTE_STATUS)
                    .apply { setLong(1, soeknad.id) }
                    .executeQuery()
                    .singleOrNull {
                        getString("status_id")?.let { id -> Status.valueOf(id) }
                    }
            }

            soeknad.apply { status = sisteStatus }
        } else null
    }

    override fun slettOgKonverterKladd(fnr: String, kilde: String): SoeknadID? =
        slettKladd(fnr, kilde, nyStatus = KONVERTERT)

    override fun slettKladd(fnr: String, kilde: String): SoeknadID? =
        slettKladd(fnr, kilde, nyStatus = SLETTET)

    private fun slettKladd(fnr: String, kilde: String, nyStatus: Status = SLETTET): SoeknadID? {
        val slettetSoeknadId = connection.use {
            it.prepareStatement(SLETT_KLADD)
                .apply {
                    setString(1, fnr)
                    setString(2, kilde)
                }
                .executeQuery()
                .singleOrNull { getLong("soeknad_id") }
        }

        return slettetSoeknadId?.also {
            nyStatus(slettetSoeknadId, nyStatus)
        }
    }

    override fun usendteSoeknader(): List<LagretSoeknad> = connection.use {
        it.prepareStatement(SELECT_OLD)
            .executeQuery()
            .toList {
                LagretSoeknad(getLong("id"), getString("fnr"), getString("payload"))
            }
    }

    override fun eldsteUsendte(): LocalDateTime? = connection.use {
        it.prepareStatement(SELECT_OLDEST_UNSENT)
            .executeQuery()
            .singleOrNull { getTimestamp(1)?.let(::asLocalDateTime) }
    }

    override fun eldsteUarkiverte(): LocalDateTime? = connection.use {
        it.prepareStatement(SELECT_OLDEST_UNARCHIVED)
            .executeQuery()
            .singleOrNull {
                getTimestamp(1)?.let(::asLocalDateTime)
            }
    }

    override fun rapport(): Map<Status, Long> {
        return connection.use {
            it.prepareStatement(SELECT_RAPPORT)
                .executeQuery()
                .toList { Status.valueOf(getString(1)) to getLong(2) }
                .toMap()
        }
    }

    override fun kilder(): Map<String, Long> {
        return connection.use {
            it.prepareStatement(SELECT_KILDE)
                .executeQuery()
                .toList { getString(1) to getLong(2) }
                .toMap()
        }
    }

    override fun ukategorisert(): List<Long> = connection.use {
        it.prepareStatement("""SELECT s.id FROM soeknad s where s.id not in (select soeknad_id from hendelse )""")
            .executeQuery()
            .toList { getLong("id") }
    }

    private fun <T> ResultSet.singleOrNull(block: ResultSet.() -> T): T? {
        return if (next()) {
            block().also {
                require(!next()) { "Skal være unik" }
            }
        } else {
            null
        }
    }

    private fun <T> ResultSet.toList(block: ResultSet.() -> T): List<T> {
        return generateSequence {
            if (next()) block()
            else null
        }.toList()
    }

    private fun asLocalDateTime(timestamp: Timestamp): LocalDateTime {
        return timestamp
            .toLocalDateTime()
            .atZone(postgresTimeZone)
            .withZoneSameInstant(ZoneId.systemDefault())
            .toLocalDateTime()
    }
}

private object Queries {
    val CREATE_SOEKNAD = """
        WITH ny_soeknad AS (
            INSERT INTO soeknad (kilde) VALUES (?) RETURNING id
        ) INSERT INTO innhold(soeknad_id, fnr, payload) 
            VALUES((SELECT id FROM ny_soeknad), ?, ?) RETURNING soeknad_id
    """.trimMargin()

    const val CREATE_HENDELSE = "INSERT INTO hendelse(soeknad_id, status_id, payload) VALUES(?, ?, ?) RETURNING id"

    const val OPPDATER_SOEKNAD = "UPDATE innhold SET payload = ? where soeknad_id = ?"

    const val OPPDATER_SOEKNAD_META = "UPDATE soeknad SET type = ?, kilde = ? where id = ?"

    val SELECT_OLD = """
        SELECT s.id, i.fnr, i.payload
        FROM soeknad s 
        INNER JOIN innhold i ON i.soeknad_id = s.id
        where not exists ( select 1 from hendelse h where h.soeknad_id = s.id 
        and ((h.status_id = '$SENDT' and h.opprettet > (now() at time zone 'utc' - interval '45 minutes')) 
        OR (h.status_id in ('$ARKIVERT', '$ARKIVERINGSFEIL'))))
        and exists(select 1 from hendelse h where h.soeknad_id = s.id and h.status_id = '$FERDIGSTILT')
        and s.opprettet < (now() at time zone 'utc' - interval '1 minutes')
        fetch first 10 rows only
    """.trimIndent()

    val SELECT_OLDEST_UNSENT = """
        SELECT MIN(s.opprettet)
        FROM soeknad s 
        where not exists (select 1 from hendelse h where h.soeknad_id = s.id and h.status_id = '$SENDT')
    """.trimIndent()

    val SELECT_OLDEST_UNARCHIVED = """
        SELECT MIN(s.opprettet)
        FROM soeknad s 
        where exists (select 1 from hendelse h where h.soeknad_id = s.id and h.status_id in ('$FERDIGSTILT'))
        and not exists (select 1 from hendelse h where h.soeknad_id = s.id and h.status_id in ('$ARKIVERT', '$ARKIVERINGSFEIL'))
    """.trimIndent()

    val SELECT_RAPPORT = """    
        SELECT st.id, count(1)
        FROM (
            SELECT DISTINCT(h.soeknad_id), MAX(s.rang) rang
            FROM hendelse h
            INNER JOIN status s on h.status_id = s.id
            GROUP BY h.soeknad_id
        ) h2
            INNER JOIN
            status st ON st.rang = h2.rang
        GROUP BY st.id
        ORDER BY st.rang;
    """.trimMargin()

    val SELECT_KILDE = """
        SELECT kilde, count(*) 
        FROM soeknad 
        GROUP BY kilde;
    """.trimIndent()

    val SLETT_ARKIVERTE_SOEKNADER = """
        DELETE FROM innhold i 
        WHERE EXISTS (SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.status_id = '$ARKIVERT') 
    """.trimIndent()

    val FINN_KLADD = """
        SELECT i.soeknad_id, i.fnr, i.payload, s.kilde
        FROM innhold i
        INNER JOIN soeknad s on s.id = i.soeknad_id
        WHERE i.fnr = ? AND s.kilde = ?
    """.trimIndent()

    val FINN_SISTE_STATUS = """
        SELECT h.status_id FROM hendelse h
        WHERE h.soeknad_id = ?
        ORDER BY h.opprettet DESC
        LIMIT 1;
    """.trimIndent()

    val SLETT_KLADD = """
        DELETE FROM innhold i
        USING soeknad s 
        WHERE s.id = i.soeknad_id AND i.fnr = ? AND s.kilde = ?
        AND NOT EXISTS ( 
            SELECT 1 FROM hendelse h 
            WHERE h.soeknad_id = i.soeknad_id 
            AND h.status_id IN (${Status.innsendt.toSqlString()}))
        RETURNING i.soeknad_id
    """.trimIndent()

    val SLETT_UTGAATTE_KLADDER = """
        DELETE FROM innhold i
        WHERE EXISTS (
          SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.status_id NOT IN (${Status.innsendt.toSqlString()}))
        AND NOT EXISTS (
          SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.opprettet >= (now() - interval '72 hours'))
        RETURNING i.soeknad_id
    """.trimIndent()
}
