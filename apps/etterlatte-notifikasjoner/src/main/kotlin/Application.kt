package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication


fun main() {
    val env = System.getenv().toMutableMap().apply {
        put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
    }
    val sendNotifikasjonApp = SendNotifikasjon(env)
    RapidApplication.create(env).also {
        Notifikasjon(sendNotifikasjonApp,it)
    }.start()
}