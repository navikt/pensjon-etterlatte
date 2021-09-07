package no.nav.etterlatte

import kotliquery.Row
import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
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
    fun slettArkiverteSoeknader()
    fun soeknadFerdigstilt(soeknad: LagretSoeknad)
    fun finnKladd(fnr: String): LagretSoeknad?
}

interface StatistikkRepository {
    fun eldsteUsendte(): LocalDateTime?
    fun eldsteUarkiverte(): LocalDateTime?
    fun rapport(): Map<String, Long>
    fun ukategorisert(): List<Long>
}

class PostgresSoeknadRepository private constructor (private val dataSource: DataSource): SoeknadRepository, StatistikkRepository {
    companion object{
        object Status{
            val sendt = "sendt"
            val arkivert = "arkivert"
            val arkiveringsfeil = "arkiveringsfeil"
            val lagretkladd = "lagretkladd"
            val ferdigstilt = "ferdigstilt"
        }

        val CREATE_SOEKNAD = "INSERT INTO soeknad(id, fnr, data) VALUES(?, ?, (to_json(?::json)))"
        val CREATE_HENDELSE = "INSERT INTO hendelse(id, soeknad, status, data) VALUES(?, ?, ?, (to_json(?::json)))"
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
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = '${Status.arkivert}')""".trimIndent()
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
            SELECT s.id, s.data FROM soeknad s
            WHERE s.fnr = ? AND NOT EXISTS ( 
              select 1 from hendelse h where h.soeknad = s.id 
              AND h.status in ('${Status.ferdigstilt}', '${Status.arkiveringsfeil}','${Status.arkivert}' ,'${Status.sendt}'))""".trimIndent()


        fun using(datasource: DataSource): PostgresSoeknadRepository{
            return PostgresSoeknadRepository(datasource)
        }
    }

    private val postgresTimeZone = ZoneId.of("UTC")
    override fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad{
        return using(sessionOf(dataSource)) { session ->
            session.transaction {
                val kladd = finnKladd(soeknad.fnr)
                if(kladd != null){
                    it.run(queryOf("""UPDATE soeknad SET data = (to_json(?::json)) where id = ?""", soeknad.soeknad, kladd.id).asUpdate)
                    LagretSoeknad(kladd.fnr, soeknad.soeknad, kladd.id)
                } else{
                    val id = it.run(queryOf("select nextval('soeknad_id')", emptyMap()).map { it.long(1) }.asSingle)!!
                    it.run(queryOf(CREATE_SOEKNAD, id, soeknad.fnr, soeknad.soeknad).asExecute)
                    LagretSoeknad(soeknad.fnr, soeknad.soeknad, id)
                }
            }
        }
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        return lagreSoeknad(soeknad).also {
            nyStatus(it, Status.lagretkladd)
        }
    }

    override fun soeknadSendt(soeknad: LagretSoeknad){
        nyStatus(soeknad, Status.sendt, """{}""")
    }

    override fun soeknadArkivert(soeknad: LagretSoeknad){
        nyStatus(soeknad, Status.arkivert, "{}")
    }

    override fun soeknadFeiletArkivering(soeknad: LagretSoeknad, jsonFeil: String) {
        nyStatus(soeknad, Status.arkiveringsfeil, jsonFeil)
    }

    private fun nyStatus(soeknad: LagretSoeknad, status: String, data: String = """{}"""){
        using(sessionOf(dataSource)) { session ->
            session.transaction {
                val id = it.run(queryOf("select nextval('hendelse_id')", emptyMap()).map { it.long(1) }.asSingle)!!
                it.run(queryOf(CREATE_HENDELSE, id, soeknad.id, status, data).asExecute)
            }
        }
    }

    override fun slettArkiverteSoeknader(){
        using(sessionOf(dataSource)) { session ->
            session.transaction {
                it.run(queryOf(DELETE_ARKIVERTE_SOEKNADER).asUpdate)
            }
        }
    }

    override fun soeknadFerdigstilt(soeknad: LagretSoeknad) {
        nyStatus(soeknad, Status.ferdigstilt, """{}""")
    }

    override fun finnKladd(fnr: String): LagretSoeknad? {
        return using(sessionOf(dataSource)) { session ->
            session.transaction { tx ->
                tx.run(queryOf(FINN_KLADD,fnr).map {
                    LagretSoeknad(
                    fnr = fnr,
                    soeknad = it.string("data"),
                    id = it.long("id")
                ) }.asSingle)
            }
        }
    }

    override fun usendteSoeknader(): List<LagretSoeknad> {
        return using(sessionOf(dataSource)) { session ->
            session.transaction {
                it.run(queryOf(
                    SELECT_OLD, emptyMap()).map {
                    LagretSoeknad(
                        fnr = it.string("fnr"),
                        soeknad = it.string("data"),
                        id = it.long("id")
                    )
                }.asList)
            }
        }
    }

    override fun eldsteUsendte(): LocalDateTime? = using(sessionOf(dataSource)) { session ->
        session.transaction {
            it.run(queryOf(
                SELECT_OLDEST_UNSENT, emptyMap()).map { row ->
                row.postgresLocalDate(1)
            }.asSingle)
        }
    }
    override fun eldsteUarkiverte(): LocalDateTime? = using(sessionOf(dataSource)) { session ->
        session.transaction {
            it.run(queryOf(
                SELECT_OLDEST_UNARCHIVED, emptyMap()).map { row ->
                row.postgresLocalDate(1)
            }.asSingle)
        }
    }
    override fun rapport(): Map<String, Long> = listOf(
        Status.lagretkladd,
        Status.ferdigstilt,
        Status.sendt,
        Status.arkivert,
        Status.lagretkladd
    ).associateWith { 0L } + using(sessionOf(dataSource)) { session ->
        session.transaction {
            it.run(queryOf(
                SELECT_RAPPORT, emptyMap()).map { row ->
                Pair(row.string(1), row.long(2))
            }.asList)
        }
    }.toMap()

    override fun ukategorisert(): List<Long> {
        return using(sessionOf(dataSource)) { session ->
            session.transaction {
                it.run(queryOf(
                    """SELECT s.id FROM soeknad s where s.id not in (select soeknad from hendelse )""", emptyMap()).map {
                    it.long("id")
                }.asList)
            }
        }    }

    private fun Row.postgresLocalDate(columnIndex: Int) =
        localDateTimeOrNull(columnIndex)
            ?.atZone(postgresTimeZone)
            ?.withZoneSameInstant(ZoneId.systemDefault())
            ?.toLocalDateTime()
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