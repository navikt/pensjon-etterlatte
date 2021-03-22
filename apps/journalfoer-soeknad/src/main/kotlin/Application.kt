package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication

fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]

    RapidApplication.create(env).apply {
        //PdfGenerator(this, AppBuilder(env).genererPdf())
        JournalfoerSoeknad(this, AppBuilder(env).genererPdf())
    }.start()
}