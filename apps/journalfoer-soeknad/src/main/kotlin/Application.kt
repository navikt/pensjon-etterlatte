package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication

fun main() {
    System.getenv().toMutableMap().apply {
        put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
    }.also { env ->
        AppBuilder(env).also { appBuilder ->
            RapidApplication.create(env).apply {
                val pdfService = appBuilder.pdfService()
                val journalfoering = appBuilder.journalfoerDok()
                JournalfoerGjenlevendepensjonSoeknad(this, pdfService, journalfoering)
                JournalfoerSoeknadForDoffen(this, pdfService, journalfoering)
                JournalfoerBarnepensjonSoeknadForPesys(this, pdfService, journalfoering)
            }.start()
        }
    }
}