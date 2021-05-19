package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication

fun main() {
    val env = System.getenv()
    RapidApplication.create(env).also {
        FinnFnrSoeknad(it)
        Monitor(it)
    }.start()
}