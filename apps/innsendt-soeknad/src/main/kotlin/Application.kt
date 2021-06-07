package no.nav.etterlatte

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection


fun main() {
    val datasourceBuilder = DataSourceBuilder(System.getenv())
    val db = PostgresSoeknadRepository.using(datasourceBuilder.getDataSource())

    val rapidApplication = RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(System.getenv()))
        .withKtorModule { apiModule { soeknadApi(db) } }
        .build().also { rapidConnection ->
            rapidConnection.register(object: RapidsConnection.StatusListener{
                val running = Job()
                val workers = mutableListOf<Job>()
                override fun onStartup(rapidsConnection: RapidsConnection) {
                    datasourceBuilder.migrate()
                    workers += GlobalScope.launch {
                        TilstandsPusher(db, SoeknadPubliserer(rapidsConnection, db)).start(running)
                    }
                    workers += GlobalScope.launch {
                        TilstandsProbe(db).start(running)
                    }
                }

                override fun onShutdown(rapidsConnection: RapidsConnection) {
                    running.complete()
                    runBlocking {
                        GlobalScope.launch {
                            workers.forEach{
                                it.join()
                            }
                        }.join()
                    }
                }
            })

            JournalpostSkrevet(rapidConnection, db)
        }

    rapidApplication.start()
}
