package soeknad

import org.slf4j.LoggerFactory
import soeknad.Queries.CREATE_HENDELSE
import soeknad.Queries.CREATE_SOEKNAD
import soeknad.Queries.FINN_KLADD
import soeknad.Queries.OPPDATER_SOEKNAD
import soeknad.Queries.SELECT_OLD
import soeknad.Queries.SELECT_OLDEST_UNARCHIVED
import soeknad.Queries.SELECT_OLDEST_UNSENT
import soeknad.Queries.SELECT_RAPPORT
import soeknad.Queries.SLETT_ARKIVERTE_SOEKNADER
import soeknad.Queries.SLETT_KLADD
import soeknad.Queries.SLETT_UTGAATTE_KLADDER
import soeknad.Status.ARKIVERINGSFEIL
import soeknad.Status.ARKIVERT
import soeknad.Status.FERDIGSTILT
import soeknad.Status.LAGRETKLADD
import soeknad.Status.SENDT
import soeknad.Status.SLETTET
import soeknad.Status.UTGAATT
import java.sql.ResultSet
import java.time.LocalDateTime
import java.time.ZoneId
import javax.sql.DataSource

interface SoeknadRepository {
    fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad
    fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad
    fun soeknadSendt(id: SoeknadID)
    fun soeknadArkivert(id: SoeknadID)
    fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String)
    fun usendteSoeknader(): List<LagretSoeknad>
    fun slettArkiverteSoeknader(): Int
    fun soeknadFerdigstilt(id: SoeknadID)
    fun finnKladd(fnr: String): LagretSoeknad?
    fun slettKladd(fnr: String): SoeknadID?
    fun slettUtgaatteKladder(): Int
}

interface StatistikkRepository {
    fun eldsteUsendte(): LocalDateTime?
    fun eldsteUarkiverte(): LocalDateTime?
    fun rapport(): Map<Status, Long>
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

    override fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        logger.info("Oppretter/oppdaterer søknad for ${soeknad.fnr}")

        return finnKladd(soeknad.fnr)
            ?.let { oppdaterSoeknad(it, soeknad.payload) }
            ?: opprettNySoeknad(soeknad)
    }

    private fun opprettNySoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        logger.info("Oppretter søknad for ${soeknad.fnr}")

        val id = connection.use {
            it.prepareStatement(CREATE_SOEKNAD)
                .apply {
                    setString(1, soeknad.fnr)
                    setString(2, soeknad.payload)
                }
                .executeQuery()
                .singleOrNull { getLong(1) }!!
        }

        return LagretSoeknad(id, soeknad.fnr, soeknad.payload)
    }

    private fun oppdaterSoeknad(kladd: LagretSoeknad, nyDataJson: String): LagretSoeknad {
        logger.info("Oppdaterer kladd for ${kladd.fnr}")

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

    override fun soeknadArkivert(id: SoeknadID) {
        nyStatus(id, ARKIVERT, "{}")
    }

    override fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String) {
        nyStatus(id, ARKIVERINGSFEIL, jsonFeil)
    }

    override fun soeknadFerdigstilt(id: SoeknadID) {
        nyStatus(id, FERDIGSTILT)
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

    override fun finnKladd(fnr: String): LagretSoeknad? = connection.use {
        it.prepareStatement(FINN_KLADD)
            .apply { setString(1, fnr) }
            .executeQuery()
            .singleOrNull {
                LagretSoeknad(getLong("soeknad_id"), fnr, getString("payload"))
            }
    }

    override fun slettKladd(fnr: String): SoeknadID? {
        val slettetSoeknadId = connection.use {
            it.prepareStatement(SLETT_KLADD)
                .apply { setString(1, fnr) }
                .executeQuery()
                .singleOrNull { getLong("soeknad_id") }
        }

        return slettetSoeknadId?.also {
            nyStatus(soeknadId = slettetSoeknadId, status = SLETTET)
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
            .singleOrNull(::asLocalDateTime)
    }

    override fun eldsteUarkiverte(): LocalDateTime? = connection.use {
        it.prepareStatement(SELECT_OLDEST_UNARCHIVED)
            .executeQuery()
            .singleOrNull(::asLocalDateTime)
    }

    override fun rapport(): Map<Status, Long> {
        return connection.use {
            it.prepareStatement(SELECT_RAPPORT)
                .executeQuery()
                .toList { Status.valueOf(getString(1)) to getLong(2) }
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

    private fun asLocalDateTime(rs: ResultSet): LocalDateTime? {
        val timestamp = rs.getTimestamp(1)
            .takeUnless { rs.wasNull() }
            ?: return null

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
            INSERT INTO soeknad DEFAULT VALUES RETURNING id
        ) INSERT INTO innhold(soeknad_id, fnr, payload) 
            VALUES((SELECT id FROM ny_soeknad), ?, ?) RETURNING soeknad_id
    """.trimMargin()

    const val CREATE_HENDELSE = "INSERT INTO hendelse(soeknad_id, status_id, payload) VALUES(?, ?, ?) RETURNING id"

    const val OPPDATER_SOEKNAD = "UPDATE innhold SET payload = ? where soeknad_id = ?"

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
        SELECT status.id, count(1)
        FROM hendelse h
        INNER JOIN status ON h.status_id = status.id
        GROUP BY status.id, status.rang
        ORDER BY status.rang
    """.trimMargin()

    val SLETT_ARKIVERTE_SOEKNADER = """
        DELETE FROM innhold i 
        WHERE EXISTS (SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.status_id = '$ARKIVERT') 
    """.trimIndent()

    val FINN_KLADD = """
        SELECT i.soeknad_id, i.fnr, i.payload FROM innhold i
        WHERE i.fnr = ? AND NOT EXISTS ( 
            SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id 
                AND h.status_id IN (${Status.innsendt.toSqlString()})
        )
    """.trimIndent()

    val SLETT_KLADD = """
        DELETE FROM innhold i
        WHERE i.fnr = ? AND NOT EXISTS ( 
            SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id 
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
