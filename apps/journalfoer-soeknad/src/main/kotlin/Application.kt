package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication

fun main() {

    val env = System.getenv()

    RapidApplication.create(env).apply {
        //PdfGenerator(this, AppBuilder(env).genererPdf())
        JournalfoerSoeknad(this, AppBuilder(env).genererPdf(), AppBuilder(env).journalfoerDok())
    }.start()
}