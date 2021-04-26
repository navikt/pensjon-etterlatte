package no.nav.etterlatte

import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import javax.sql.DataSource

class SoeknadDao(private val dataSource: DataSource) {
    companion object{
        val CREATE_SOEKNAD = "INSERT INTO soeknad(id, fnr, data) VALUES(?, ?, (to_json(?::json)))"
        val CREATE_HENDELSE = "INSERT INTO hendelse(id, soeknad, status, data) VALUES(?, ?, ?, (to_json(?::json)))"
        val SELECT_OLD = """
                        SELECT *, now() - interval '5 minutes' 
                        FROM soeknad s 
                        where not exists (select 1 from hendelse h where h.soeknad = s.id and h.status = 'sendt') and s.opprettet < (now() at time zone 'utc' - interval '15 minutes')
                        fetch first 10 rows only""".trimIndent()
    }
    fun nySoeknad(soeknad: UlagretSoeknad): LagretSoeknad{
        return using(sessionOf(dataSource)) { session ->
            session.transaction {
                val id = it.run(queryOf("select nextval('soeknad_id')", emptyMap()).map { it.long(1) }.asSingle)!!
                it.run(queryOf(CREATE_SOEKNAD, id, soeknad.fnr, soeknad.soeknad).asExecute)
                LagretSoeknad(soeknad.fnr, soeknad.soeknad, id)
            }
        }
    }
    fun soeknadSendt(soeknad: LagretSoeknad){
        nyStatus(soeknad, "sendt", """{}""")
    }

    fun soeknadJournalfoert(soeknad: LagretSoeknad){
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

    fun usendteSoeknader(): List<LagretSoeknad> {
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