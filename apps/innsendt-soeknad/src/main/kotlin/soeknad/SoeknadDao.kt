package soeknad

import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.utils.database.singleOrNull
import no.nav.etterlatte.libs.utils.database.toList
import no.nav.etterlatte.toJson
import org.slf4j.LoggerFactory
import soeknad.Queries.CREATE_HENDELSE
import soeknad.Queries.CREATE_SOEKNAD
import soeknad.Queries.FINN_KLADD
import soeknad.Queries.FINN_SISTE_STATUS
import soeknad.Queries.OPPDATER_SOEKNAD
import soeknad.Queries.OPPDATER_SOEKNAD_META
import soeknad.Queries.SELECT_KILDE
import soeknad.Queries.SELECT_OLD
import soeknad.Queries.SELECT_OLDEST_UNARCHIVED
import soeknad.Queries.SELECT_OLDEST_UNSENT
import soeknad.Queries.SELECT_OLD_NO_BEHANDLING
import soeknad.Queries.SELECT_RAPPORT
import soeknad.Queries.SLETT_ARKIVERTE_SOEKNADER
import soeknad.Queries.SLETT_KLADD
import soeknad.Queries.SLETT_UTGAATTE_KLADDER
import soeknad.Status.ARKIVERINGSFEIL
import soeknad.Status.ARKIVERT
import soeknad.Status.BEHANDLINGLAGRET
import soeknad.Status.FERDIGSTILT
import soeknad.Status.KONVERTERT
import soeknad.Status.LAGRETKLADD
import soeknad.Status.SENDT
import soeknad.Status.SLETTET
import soeknad.Status.UTGAATT
import soeknad.Status.VENTERBEHANDLING
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.UUID
import javax.sql.DataSource

interface SoeknadRepository {
    fun ferdigstillSoeknad(soeknad: UlagretSoeknad): SoeknadID

    fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad

    fun soeknadSendt(id: SoeknadID)

    fun soeknadArkivert(
        id: SoeknadID,
        payload: String? = null,
    )

    fun soeknadTilDoffenArkivert(
        id: SoeknadID,
        payload: String? = null,
    )

    fun soeknadHarBehandling(
        id: SoeknadID,
        sakId: Long,
        behandlingId: UUID,
    )

    fun soeknadFeiletArkivering(
        id: SoeknadID,
        jsonFeil: String,
    )

    fun usendteSoeknader(): List<LagretSoeknad>

    fun slettArkiverteSoeknader(): Int

    fun finnKladd(
        fnr: String,
        kilde: String,
    ): LagretSoeknad?

    fun slettKladd(
        fnr: String,
        kilde: String,
    ): SoeknadID?

    fun slettOgKonverterKladd(
        fnr: String,
        kilde: String,
    ): SoeknadID?

    fun slettUtgaatteKladder(): List<SlettetSoeknad>

    fun arkiverteUtenBehandlingIDoffen(): List<LagretSoeknad>
}

interface StatistikkRepository {
    fun eldsteUsendte(): LocalDateTime?

    fun eldsteUarkiverte(): LocalDateTime?

    fun rapport(): List<RapportLinje>

    fun kilder(): Map<String, Long>

    // Hvor mange søknader som har vært innom en gitt status
    fun soeknaderMedHendelseStatus(status: Status): Long?

    fun ferdigstillelsesgradSiste30dagerProsent(): Double
}

class PostgresSoeknadRepository private constructor(
    private val ds: DataSource,
) : SoeknadRepository,
    StatistikkRepository {
    private val logger = LoggerFactory.getLogger(PostgresSoeknadRepository::class.java)

    companion object {
        fun using(datasource: DataSource): PostgresSoeknadRepository = PostgresSoeknadRepository(datasource)
    }

    private val connection get() = ds.connection

    private val postgresTimeZone = ZoneId.of("UTC")

    override fun ferdigstillSoeknad(soeknad: UlagretSoeknad): SoeknadID =
        lagreSoeknad(soeknad)
            .id
            .also { id ->
                logger.info("Ferdigstiller søknad med id $id")
                nyStatus(id, FERDIGSTILT)
                oppdaterSoeknadMeta(id, soeknad.type, soeknad.kilde)
            }

    private fun oppdaterSoeknadMeta(
        id: SoeknadID,
        type: SoeknadType?,
        kilde: String?,
    ) = connection.use {
        it
            .prepareStatement(OPPDATER_SOEKNAD_META)
            .apply {
                setString(1, type?.name)
                setString(2, kilde)
                setLong(3, id)
            }.executeUpdate()
    }

    private fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        val lagretSoeknad = finnKladd(soeknad.fnr, soeknad.kilde)

        return if (lagretSoeknad == null) {
            logger.info("Søknad finnes ikke i databasen. Oppretter ny søknad.")
            opprettNySoeknad(soeknad)
        } else if (lagretSoeknad.status != null && lagretSoeknad.status != LAGRETKLADD) {
            throw Exception("Bruker har allerede en ferdigstilt søknad (id=${lagretSoeknad.id}) under behandling")
        } else {
            logger.info("Søknad finnes allerede (id=${lagretSoeknad.id}). Oppdaterer søknad med nytt innhold.")
            oppdaterSoeknad(lagretSoeknad, soeknad.payload)
        }
    }

    private fun opprettNySoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        val id =
            connection.use {
                it
                    .prepareStatement(CREATE_SOEKNAD)
                    .apply {
                        setString(1, soeknad.kilde)
                        setString(2, soeknad.fnr)
                        setString(3, soeknad.payload)
                    }.executeQuery()
                    .singleOrNull { getLong(1) }!!
            }

        return LagretSoeknad(id, soeknad.fnr, soeknad.payload)
    }

    private fun oppdaterSoeknad(
        kladd: LagretSoeknad,
        nyDataJson: String,
    ): LagretSoeknad {
        connection.use {
            it
                .prepareStatement(OPPDATER_SOEKNAD)
                .apply {
                    setString(1, nyDataJson)
                    setLong(2, kladd.id)
                }.executeUpdate()
        }

        return LagretSoeknad(kladd.id, kladd.fnr, nyDataJson)
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad =
        lagreSoeknad(soeknad).also {
            nyStatus(it.id, LAGRETKLADD)
        }

    override fun soeknadSendt(id: SoeknadID) {
        nyStatus(id, SENDT, """{}""")
    }

    override fun soeknadArkivert(
        id: SoeknadID,
        payload: String?,
    ) {
        nyStatus(id, ARKIVERT, payload ?: """{}""")
    }

    override fun soeknadHarBehandling(
        id: SoeknadID,
        sakId: Long,
        behandlingId: UUID,
    ) {
        nyStatus(id, BEHANDLINGLAGRET, mapOf("sakId" to sakId, "behandlingId" to behandlingId.toString()).toJson())
    }

    override fun soeknadFeiletArkivering(
        id: SoeknadID,
        jsonFeil: String,
    ) {
        nyStatus(id, ARKIVERINGSFEIL, jsonFeil)
    }

    private fun nyStatus(
        soeknadId: SoeknadID,
        status: Status,
        payload: String = """{}""",
    ) {
        connection.use {
            it
                .prepareStatement(CREATE_HENDELSE)
                .apply {
                    setLong(1, soeknadId)
                    setString(2, status.name)
                    setString(3, payload)
                }.execute()
        }
    }

    override fun slettArkiverteSoeknader(): Int =
        connection.use {
            it.prepareStatement(SLETT_ARKIVERTE_SOEKNADER).executeUpdate()
        }

    override fun slettUtgaatteKladder(): List<SlettetSoeknad> {
        val slettedeKladder =
            connection.use {
                it
                    .prepareStatement(SLETT_UTGAATTE_KLADDER)
                    .executeQuery()
                    .toList { SlettetSoeknad(getLong(1), getString(2)) }
            }

        slettedeKladder.forEach { nyStatus(soeknadId = it.id, status = UTGAATT) }

        return slettedeKladder
    }

    override fun soeknadTilDoffenArkivert(
        id: SoeknadID,
        payload: String?,
    ) {
        nyStatus(soeknadId = id, status = VENTERBEHANDLING, payload = payload ?: """{}""")
    }

    override fun finnKladd(
        fnr: String,
        kilde: String,
    ): LagretSoeknad? {
        val soeknad =
            connection.use {
                it
                    .prepareStatement(FINN_KLADD)
                    .apply {
                        setString(1, fnr)
                        setString(2, kilde)
                    }.executeQuery()
                    .singleOrNull {
                        LagretSoeknad(getLong("soeknad_id"), fnr, getString("payload"))
                    }
            }

        return if (soeknad != null) {
            val sisteStatus =
                connection.use {
                    it
                        .prepareStatement(FINN_SISTE_STATUS)
                        .apply { setLong(1, soeknad.id) }
                        .executeQuery()
                        .singleOrNull {
                            getString("status_id")?.let { id -> Status.valueOf(id) }
                        }
                }

            soeknad.apply { status = sisteStatus }
        } else {
            null
        }
    }

    override fun slettOgKonverterKladd(
        fnr: String,
        kilde: String,
    ): SoeknadID? = slettKladd(fnr, kilde, nyStatus = KONVERTERT)

    override fun slettKladd(
        fnr: String,
        kilde: String,
    ): SoeknadID? = slettKladd(fnr, kilde, nyStatus = SLETTET)

    private fun slettKladd(
        fnr: String,
        kilde: String,
        nyStatus: Status = SLETTET,
    ): SoeknadID? {
        val slettetSoeknadId =
            connection.use {
                it
                    .prepareStatement(SLETT_KLADD)
                    .apply {
                        setString(1, fnr)
                        setString(2, kilde)
                    }.executeQuery()
                    .singleOrNull { getLong("soeknad_id") }
            }

        return slettetSoeknadId?.also {
            nyStatus(slettetSoeknadId, nyStatus)
        }
    }

    override fun usendteSoeknader(): List<LagretSoeknad> =
        connection.use {
            it
                .prepareStatement(SELECT_OLD)
                .executeQuery()
                .toList {
                    LagretSoeknad(getLong("id"), getString("fnr"), getString("payload"))
                }
        }

    override fun arkiverteUtenBehandlingIDoffen(): List<LagretSoeknad> =
        connection.use {
            it
                .prepareStatement(SELECT_OLD_NO_BEHANDLING)
                .executeQuery()
                .toList {
                    LagretSoeknad(getLong("id"), getString("fnr"), getString("payload"))
                }
        }

    override fun eldsteUsendte(): LocalDateTime? =
        connection.use {
            it
                .prepareStatement(SELECT_OLDEST_UNSENT)
                .executeQuery()
                .singleOrNull { getTimestamp(1)?.let(::asLocalDateTime) }
        }

    override fun eldsteUarkiverte(): LocalDateTime? =
        connection.use {
            it
                .prepareStatement(SELECT_OLDEST_UNARCHIVED)
                .executeQuery()
                .singleOrNull {
                    getTimestamp(1)?.let(::asLocalDateTime)
                }
        }

    override fun rapport(): List<RapportLinje> =
        connection.use {
            it
                .prepareStatement(SELECT_RAPPORT)
                .executeQuery()
                .toList { RapportLinje(Status.valueOf(getString(1)), getString(2), getLong(3)) }
        }

    override fun kilder(): Map<String, Long> =
        connection.use {
            it
                .prepareStatement(SELECT_KILDE)
                .executeQuery()
                .toList { getString(1) to getLong(2) }
                .toMap()
        }

    override fun soeknaderMedHendelseStatus(status: Status): Long? {
        return connection.use {
            it.prepareStatement(
                Queries.SELECT_COUNT_PER_HENDELSE_STATUS_LIST
            )
                .apply {
                    setString(1, status.name)
                }
                .executeQuery()
                .singleOrNull { getLong(1) }
        }
    }

    override fun ferdigstillelsesgradSiste30dagerProsent(): Double {
        return requireNotNull(
            connection.use {
                it
                    .prepareStatement(
                        Queries.FERDIGSTILLELSESGRAD_SISTE_30_DAGER
                    )
                    .executeQuery()
                    .singleOrNull { getDouble(1) }
            }
        )
    }

    private fun asLocalDateTime(timestamp: Timestamp): LocalDateTime =
        timestamp
            .toLocalDateTime()
            .atZone(postgresTimeZone)
            .withZoneSameInstant(ZoneId.systemDefault())
            .toLocalDateTime()
}

private object Queries {
    val CREATE_SOEKNAD =
        """
        WITH ny_soeknad AS (
            INSERT INTO soeknad (kilde) VALUES (?) RETURNING id
        ) INSERT INTO innhold(soeknad_id, fnr, payload) 
            VALUES((SELECT id FROM ny_soeknad), ?, ?) RETURNING soeknad_id
        """.trimIndent()

    const val CREATE_HENDELSE = "INSERT INTO hendelse(soeknad_id, status_id, payload) VALUES(?, ?, ?) RETURNING id"

    const val OPPDATER_SOEKNAD = "UPDATE innhold SET payload = ? where soeknad_id = ?"

    const val OPPDATER_SOEKNAD_META = "UPDATE soeknad SET type = ?, kilde = ? where id = ?"

    val SELECT_OLD =
        """
        SELECT s.id, i.fnr, i.payload
        FROM soeknad s 
        INNER JOIN innhold i ON i.soeknad_id = s.id
        where not exists ( select 1 from hendelse h where h.soeknad_id = s.id 
        and ((h.status_id = '$SENDT' and h.opprettet > (now() at time zone 'utc' - interval '45 minutes')) 
        OR (h.status_id in ('$ARKIVERT', '$ARKIVERINGSFEIL', '$VENTERBEHANDLING', '$BEHANDLINGLAGRET'))))
        and exists(select 1 from hendelse h where h.soeknad_id = s.id and h.status_id = '$FERDIGSTILT')
        and s.opprettet < (now() at time zone 'utc' - interval '1 minutes')
        fetch first 10 rows only
        """.trimIndent()

    val SELECT_OLD_NO_BEHANDLING =
        """
        SELECT s.id, i.fnr, i.payload
        FROM soeknad s 
        INNER JOIN innhold i ON i.soeknad_id = s.id
        where not exists ( select 1 from hendelse h where h.soeknad_id = s.id 
        and ((h.status_id = '$SENDT' and h.opprettet > (now() at time zone 'utc' - interval '45 minutes')) 
        OR (h.status_id in ('$ARKIVERT', '$ARKIVERINGSFEIL', '$BEHANDLINGLAGRET'))))
        and exists(select 1 from hendelse h where h.soeknad_id = s.id and h.status_id = '$VENTERBEHANDLING')
        and s.opprettet < (now() at time zone 'utc' - interval '1 minutes')
        fetch first 10 rows only
        """.trimIndent()

    val SELECT_OLDEST_UNSENT =
        """
        SELECT MIN(s.opprettet)
        FROM soeknad s 
        where not exists (select 1 from hendelse h where h.soeknad_id = s.id and h.status_id = '$SENDT')
        """.trimIndent()

    val SELECT_OLDEST_UNARCHIVED =
        """
        SELECT MIN(s.opprettet)
        FROM soeknad s 
        where exists (select 1 from hendelse h where h.soeknad_id = s.id and h.status_id in ('$FERDIGSTILT'))
        and not exists (select 1 from hendelse h where h.soeknad_id = s.id and h.status_id in ('$ARKIVERT', '$ARKIVERINGSFEIL', '$VENTERBEHANDLING', '$BEHANDLINGLAGRET'))
        """.trimIndent()

    val SELECT_RAPPORT =
        """    
        SELECT st.id as status, h2.kilde, count(1)
        FROM (
            SELECT DISTINCT(h.soeknad_id), MAX(s.rang) rang, h.kilde
            FROM (
                SELECT soeknad_id, status_id, s.kilde 
                FROM hendelse h2 
                INNER JOIN soeknad s on s.id = h2.soeknad_id
            ) h
            INNER JOIN status s ON h.status_id = s.id
            GROUP BY h.soeknad_id, h.kilde
        ) h2
        INNER JOIN
        status st ON st.rang = h2.rang
        GROUP BY st.id, h2.kilde
        ORDER BY st.rang;
        """.trimIndent()

    val SELECT_KILDE =
        """
        SELECT kilde, count(*) 
        FROM soeknad 
        GROUP BY kilde;
        """.trimIndent()

    val SLETT_ARKIVERTE_SOEKNADER =
        """
        DELETE FROM innhold i 
        WHERE EXISTS (SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.status_id in ('$ARKIVERT', '$BEHANDLINGLAGRET')) 
        """.trimIndent()

    val FINN_KLADD =
        """
        SELECT i.soeknad_id, i.fnr, i.payload, s.kilde
        FROM innhold i
        INNER JOIN soeknad s on s.id = i.soeknad_id
        WHERE i.fnr = ? AND s.kilde = ?
        """.trimIndent()

    val FINN_SISTE_STATUS =
        """
        SELECT h.status_id FROM hendelse h
        WHERE h.soeknad_id = ?
        ORDER BY h.opprettet DESC
        LIMIT 1;
        """.trimIndent()

    val SLETT_KLADD =
        """
        DELETE FROM innhold i
        USING soeknad s 
        WHERE s.id = i.soeknad_id AND i.fnr = ? AND s.kilde = ?
        AND NOT EXISTS ( 
            SELECT 1 FROM hendelse h 
            WHERE h.soeknad_id = i.soeknad_id 
            AND h.status_id IN (${Status.innsendt.toSqlString()}))
        RETURNING i.soeknad_id
        """.trimIndent()

    val SLETT_UTGAATTE_KLADDER =
        """
        DELETE FROM innhold i
        WHERE EXISTS (
          SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.status_id NOT IN (${Status.innsendt.toSqlString()}))
        AND NOT EXISTS (
          SELECT 1 FROM hendelse h WHERE h.soeknad_id = i.soeknad_id AND h.opprettet >= (now() - interval '72 hours'))
        RETURNING i.soeknad_id, i.fnr
        """.trimIndent()

    val SELECT_COUNT_PER_HENDELSE_STATUS_LIST =
        """
        SELECT COUNT(DISTINCT soeknad_id) 
        FROM hendelse h 
        WHERE h.status_id = ?
        """.trimIndent()

    val FERDIGSTILLELSESGRAD_SISTE_30_DAGER =
        """        
        SELECT 100.0 *  
            (SELECT CAST(COUNT(DISTINCT hf.soeknad_id) AS float)
            FROM hendelse hf JOIN hendelse hk 
              ON hk.soeknad_id = hf.soeknad_id
            WHERE hf.status_id = 'FERDIGSTILT'
              AND hk.status_id = 'LAGRETKLADD'
              AND hk.opprettet >= (now() - interval '30 days'))
        /
            (SELECT CAST(COUNT(DISTINCT hk.soeknad_id) AS float)
            FROM hendelse hk
            WHERE hk.status_id = 'LAGRETKLADD'
            AND hk.opprettet >= (now() - interval '30 days'))
        """.trimIndent()
}