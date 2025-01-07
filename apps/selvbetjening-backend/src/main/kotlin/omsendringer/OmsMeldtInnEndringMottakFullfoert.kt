package no.nav.etterlatte.omsendringer

import no.nav.helse.rapids_rivers.RapidsConnection
import org.slf4j.LoggerFactory

class OmsMeldtInnEndringMottakFullfoert(
    rapidsConnection: RapidsConnection,
    private val service: OmsMeldInnEndringService,
) {
    private val logger = LoggerFactory.getLogger(OmsMeldtInnEndringMottakFullfoert::class.java)
}