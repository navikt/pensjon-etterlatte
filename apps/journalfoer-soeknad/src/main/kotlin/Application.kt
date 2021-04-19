package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication

fun main() {
    System.getenv().also { env ->
        AppBuilder(env).also { appBuilder ->
            RapidApplication.create(env).apply {
                JournalfoerSoeknad(this, appBuilder.genererPdf(), appBuilder.journalfoerDok())
            }.start()
        }
    }
}