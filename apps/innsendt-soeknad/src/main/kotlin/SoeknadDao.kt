package no.nav.etterlatte

import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import java.time.LocalDateTime
import java.time.ZoneId
import javax.sql.DataSource

interface SoeknadRepository {
    fun nySoeknad(soeknad: UlagretSoeknad): LagretSoeknad
    fun soeknadSendt(soeknad: LagretSoeknad)
    fun soeknadJournalfoert(soeknad: LagretSoeknad)
    fun usendteSoeknader(): List<LagretSoeknad>
}

class PostgresSoeknadRepository private constructor (private val dataSource: DataSource): SoeknadRepository {
    companion object{
        val CREATE_SOEKNAD = "INSERT INTO soeknad(id, fnr, data) VALUES(?, ?, (to_json(?::json)))"
        val CREATE_HENDELSE = "INSERT INTO hendelse(id, soeknad, status, data) VALUES(?, ?, ?, (to_json(?::json)))"
        val SELECT_OLD = """
                        SELECT *, now() - interval '5 minutes' 
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'sendt') and s.opprettet < (now() at time zone 'utc' - interval '1 minutes')
                        fetch first 10 rows only""".trimIndent()
        val SELECT_OLDEST_UNSENT = """
                        SELECT MIN(s.opprettet)
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'sendt')""".trimIndent()
        val SELECT_OLDEST_UNARCHIVED = """
                        SELECT MIN(s.opprettet)
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'journalfoert')""".trimIndent()
        val SELECT_RAPPORT = """
                        SELECT 'opprettet', count(1) 
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status in ('sendt', 'journalfoert'))
                        UNION
                        SELECT 'sendt', count(1) 
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'journalfoert')
                        AND exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'sendt')
                        UNION
                        SELECT 'arkivert', count(1) 
                        FROM soeknad s 
                        where exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'journalfoert')""".trimIndent()




        fun using(datasource: DataSource): PostgresSoeknadRepository{
            return PostgresSoeknadRepository(datasource)
        }
    }
    override fun nySoeknad(soeknad: UlagretSoeknad): LagretSoeknad{
        return using(sessionOf(dataSource)) { session ->
            session.transaction {
                val id = it.run(queryOf("select nextval('soeknad_id')", emptyMap()).map { it.long(1) }.asSingle)!!
                it.run(queryOf(CREATE_SOEKNAD, id, soeknad.fnr, soeknad.soeknad).asExecute)
                LagretSoeknad(soeknad.fnr, soeknad.soeknad, id)
            }
        }
    }
    override fun soeknadSendt(soeknad: LagretSoeknad){
        nyStatus(soeknad, "sendt", """{}""")
    }

    override fun soeknadJournalfoert(soeknad: LagretSoeknad){
        nyStatus(soeknad, "journalfoert", "{}")
    }

    private fun nyStatus(soeknad: LagretSoeknad, status: String, data: String){
        using(sessionOf(dataSource)) { session ->
            session.transaction {
                val id = it.run(queryOf("select nextval('hendelse_id')", emptyMap()).map { it.long(1) }.asSingle)!!
                it.run(queryOf(CREATE_HENDELSE, id, soeknad.id, status, data).asExecute)
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

    fun eldsteUsendte(): LocalDateTime? = using(sessionOf(dataSource)) { session ->
        session.transaction {
            it.run(queryOf(
                SELECT_OLDEST_UNSENT, emptyMap()).map { row ->
                row.localDateTimeOrNull(1)?.let{
                    it.atZone(ZoneId.of("UTC")).withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime()
                }
            }.asSingle)
        }
    }
    fun eldsteUarkiverte(): LocalDateTime? = using(sessionOf(dataSource)) { session ->
        session.transaction {
            it.run(queryOf(
                SELECT_OLDEST_UNARCHIVED, emptyMap()).map { row ->
                row.localDateTimeOrNull(1)?.let{
                    it.atZone(ZoneId.of("UTC")).withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime()
                }
            }.asSingle)
        }
    }
    fun rapport(): Map<String, Long> = using(sessionOf(dataSource)) { session ->
        session.transaction {
            it.run(queryOf(
                SELECT_RAPPORT, emptyMap()).map { row ->
                Pair(row.string(1), row.long(2))
            }.asList)
        }
    }.toMap()
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

data class Rapport(
    val opprettet: Long,
    val sendt: Long,
    val arkivert: Long
    )