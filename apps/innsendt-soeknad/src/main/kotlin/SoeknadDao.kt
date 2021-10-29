package no.nav.etterlatte

import java.sql.ResultSet
import java.time.LocalDateTime
import java.time.ZoneId
import javax.sql.DataSource

interface SoeknadRepository {
    fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad
    fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad
    fun soeknadSendt(soeknad: LagretSoeknad)
    fun soeknadArkivert(soeknad: LagretSoeknad)
    fun soeknadFeiletArkivering(soeknad: LagretSoeknad, jsonFeil: String)
    fun usendteSoeknader(): List<LagretSoeknad>
    fun slettArkiverteSoeknader(): Int
    fun soeknadFerdigstilt(soeknad: LagretSoeknad)
    fun finnKladd(fnr: String): LagretSoeknad?
    fun slettKladd(fnr: String): Boolean
    fun slettUtgaatteKladder(): Int
}

interface StatistikkRepository {
    fun eldsteUsendte(): LocalDateTime?
    fun eldsteUarkiverte(): LocalDateTime?
    fun rapport(): Map<String, Long>
    fun ukategorisert(): List<Long>
}

class PostgresSoeknadRepository private constructor(
    private val ds: DataSource
) : SoeknadRepository, StatistikkRepository {

    companion object {
        object Status {
            const val sendt = "sendt"
            const val arkivert = "arkivert"
            const val arkiveringsfeil = "arkiveringsfeil"
            const val lagretkladd = "lagretkladd"
            const val ferdigstilt = "ferdigstilt"
        }

        const val CREATE_SOEKNAD = "INSERT INTO soeknad(id, fnr, data) VALUES(?, ?, (to_json(?::json)))"
        const val CREATE_HENDELSE =
            "INSERT INTO hendelse(id, soeknad, status, data) VALUES(?, ?, ?, (to_json(?::json)))"
        val SELECT_OLD = """
                        SELECT *
                        FROM soeknad s 
                        where not exists ( select 1 from hendelse h where h.soeknad = s.id 
                            and ((h.status = '${Status.sendt}' and h.opprettet > (now() at time zone 'utc' - interval '45 minutes')) 
                            OR (h.status in ('${Status.arkivert}', '${Status.arkiveringsfeil}'))))
                        and exists(select 1 from hendelse h where h.soeknad = s.id and h.status = '${Status.ferdigstilt}')
                            and s.opprettet < (now() at time zone 'utc' - interval '1 minutes')
                        fetch first 10 rows only""".trimIndent()
        val SELECT_OLDEST_UNSENT = """
                        SELECT MIN(s.opprettet)
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = '${Status.sendt}')""".trimIndent()
        val SELECT_OLDEST_UNARCHIVED = """
                        SELECT MIN(s.opprettet)
                        FROM soeknad s 
                        where exists (select 1 from hendelse h where h.soeknad = s.id and h.status in ('${Status.ferdigstilt}'))
                        and not exists (select 1 from hendelse h where h.soeknad = s.id and h.status in ('${Status.arkivert}', '${Status.arkiveringsfeil}'))""".trimIndent()
        val SELECT_RAPPORT = """with status_rang as (
                        |select 'lagretkladd' "status", 0 "rang"
                        |union select 'ferdigstilt' "status", 1 "rang"
                        |union select 'sendt' "status", 2 "rang"
                        |union select 'arkivert' "status", 3 "rang"
                        |union select 'arkiveringsfeil' "status", 4 "rang"
                        |) select status, count(1) from 
                        |(select soeknad, max(rang) "rang" from hendelse h inner join status_rang using(status) group by soeknad) valgtstatus
                        |inner join status_rang using(rang)
                        |group by status""".trimMargin()
        val DELETE_ARKIVERTE_SOEKNADER = """
            DELETE FROM soeknad s where exists (select 1 from hendelse h where h.soeknad = s.id and h.status = '${Status.arkivert}') 
        """.trimIndent()
        val FINN_KLADD = """
            SELECT s.id, s.fnr, s.data FROM soeknad s
            WHERE s.fnr = ? AND NOT EXISTS ( 
              select 1 from hendelse h where h.soeknad = s.id 
              AND h.status in ('${Status.ferdigstilt}', '${Status.arkiveringsfeil}','${Status.arkivert}' ,'${Status.sendt}'))""".trimIndent()
        val SLETT_KLADD = """
            DELETE FROM soeknad s
            WHERE s.fnr = ? AND NOT EXISTS ( 
              select 1 from hendelse h where h.soeknad = s.id 
              AND h.status in ('${Status.ferdigstilt}', '${Status.arkiveringsfeil}','${Status.arkivert}' ,'${Status.sendt}'))""".trimIndent()
        val SLETT_UTGAATTE_KLADDER = """
            DELETE FROM soeknad s
            WHERE EXISTS (
              SELECT 1 FROM hendelse h WHERE h.soeknad = s.id AND h.status = '${Status.lagretkladd}')
            AND NOT EXISTS (
              SELECT 1 FROM hendelse h WHERE h.soeknad = s.id AND h.status != '${Status.lagretkladd}')
            AND NOT EXISTS (
              SELECT 1 FROM hendelse h WHERE h.soeknad = s.id AND h.opprettet >= (now() - interval '72 hours'))
        """.trimIndent()

        fun using(datasource: DataSource): PostgresSoeknadRepository {
            return PostgresSoeknadRepository(datasource)
        }
    }

    private val connection get() = ds.connection

    private val postgresTimeZone = ZoneId.of("UTC")

    override fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        return finnKladd(soeknad.fnr)
            ?.let { oppdaterSoeknad(it, soeknad.soeknad) }
            ?: opprettNySoeknad(soeknad)
    }

    private fun opprettNySoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        val id = connection.use {
            it.prepareStatement("select nextval('soeknad_id')")
                .executeQuery()
                .singleOrNull { getLong(1) }
        }!!

        connection.use {
            it.prepareStatement(CREATE_SOEKNAD)
                .apply {
                    setLong(1, id)
                    setString(2, soeknad.fnr)
                    setString(3, soeknad.soeknad)
                }
                .execute()
        }

        return LagretSoeknad(soeknad.fnr, soeknad.soeknad, id)
    }

    private fun oppdaterSoeknad(kladd: LagretSoeknad, nyDataJson: String): LagretSoeknad {
        connection.use {
            it.prepareStatement("""UPDATE soeknad SET data = (to_json(?::json)) where id = ?""")
                .apply {
                    setString(1, nyDataJson)
                    setLong(2, kladd.id)
                }
                .executeUpdate()
        }

        return LagretSoeknad(kladd.fnr, nyDataJson, kladd.id)
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        return lagreSoeknad(soeknad).also {
            nyStatus(it, Status.lagretkladd)
        }
    }

    override fun soeknadSendt(soeknad: LagretSoeknad) {
        nyStatus(soeknad, Status.sendt, """{}""")
    }

    override fun soeknadArkivert(soeknad: LagretSoeknad) {
        nyStatus(soeknad, Status.arkivert, "{}")
    }

    override fun soeknadFeiletArkivering(soeknad: LagretSoeknad, jsonFeil: String) {
        nyStatus(soeknad, Status.arkiveringsfeil, jsonFeil)
    }

    private fun nyStatus(soeknad: LagretSoeknad, status: String, data: String = """{}""") {
        val id = connection.use {
            it.prepareStatement("select nextval('hendelse_id')")
                .executeQuery()
                .singleOrNull { getLong(1) }
        }!!

        connection.use {
            it.prepareStatement(CREATE_HENDELSE)
                .apply {
                    setLong(1, id)
                    setLong(2, soeknad.id)
                    setString(3, status)
                    setString(4, data)
                }
                .execute()
        }
    }

    override fun slettArkiverteSoeknader(): Int = connection.use {
        it.prepareStatement(DELETE_ARKIVERTE_SOEKNADER).executeUpdate()
    }

    override fun slettUtgaatteKladder(): Int = connection.use {
        it.prepareStatement(SLETT_UTGAATTE_KLADDER).executeUpdate()
    }

    override fun soeknadFerdigstilt(soeknad: LagretSoeknad) {
        nyStatus(soeknad, Status.ferdigstilt, """{}""")
    }

    override fun finnKladd(fnr: String): LagretSoeknad? = connection.use {
        it.prepareStatement(FINN_KLADD)
            .apply { setString(1, fnr) }
            .executeQuery()
            .singleOrNull {
                LagretSoeknad(id = getLong("id"), fnr = fnr, soeknad = getString("data"))
            }
    }

    override fun slettKladd(fnr: String): Boolean = connection.use {
        val antallSlettet = it.prepareStatement(SLETT_KLADD)
            .apply { setString(1, fnr) }
            .executeUpdate()

        return antallSlettet > 0
    }

    override fun usendteSoeknader(): List<LagretSoeknad> = connection.use {
        it.prepareStatement(SELECT_OLD)
            .executeQuery()
            .toList {
                LagretSoeknad(id = getLong("id"), fnr = getString("fnr"), soeknad = getString("data"))
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

    override fun rapport(): Map<String, Long> {
        return listOf(
            Status.lagretkladd,
            Status.ferdigstilt,
            Status.sendt,
            Status.arkivert,
            Status.lagretkladd
        ).associateWith { 0L } + connection.use {
            it.prepareStatement(SELECT_RAPPORT)
                .executeQuery()
                .toList { getString(1) to getLong(2) }
                .toMap()
        }
    }

    override fun ukategorisert(): List<Long> = connection.use {
        it.prepareStatement("""SELECT s.id FROM soeknad s where s.id not in (select soeknad from hendelse )""")
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

data class LagretSoeknad(
    val fnr: String,
    val soeknad: String,
    val id: Long
)

data class UlagretSoeknad(
    val fnr: String,
    val soeknad: String
)
