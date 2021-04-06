package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import org.slf4j.LoggerFactory
import java.util.*

interface IDodsmeldinger {
    fun personErDod(ident: String, doedsdato: String?)
}

class DodsmeldingerRapid(private val context: RapidsConnection) : IDodsmeldinger {
    val logger = LoggerFactory.getLogger(this.javaClass)

    override fun personErDod(ident: String, doedsdato: String?) {
        logger.info("Poster at person $ident er død")
        context.publish(UUID.randomUUID().toString(), JsonMessage("{}", MessageProblems("{}"))
            .apply {
                set("@event_name", "person_dod")
                set("@avdod_ident", ident)
                doedsdato?.also {
                    set("@avdod_doedsdato", it)
                }
            }
            .toJson())
    }

}