package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndringStatus
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory
import java.util.UUID
import kotlin.jvm.java

class OmsMeldInnEndringService(
    private val repository: OmsMeldInnEndringRepository,
) {
    private val logger = LoggerFactory.getLogger(OmsMeldInnEndringService::class.java)

    fun lagreEndringer(
        fnr: Foedselsnummer,
        request: OmsMeldtInnEndringRequest,
    ) {
        try {
            repository.lagreEndringer(
                OmsMeldtInnEndring(
                    fnr = fnr,
                    endring = request.endring,
                    beskrivelse = request.beskrivelse,
                    forventetInntektTilNesteAar = request.forventetInntektTilNesteAar,
                ),
            )
        } catch (e: Error) {
            logger.error("Kunne ikke lagre meldt inn endring", e)
        }
    }

    fun hentEndringerMedStatus(lagret: OmsMeldtInnEndringStatus) = repository.hentEndringerMedStatus(lagret)

    fun oppdaterStatusForId(
        id: UUID,
        status: OmsMeldtInnEndringStatus,
    ) {
        repository.oppdaterStatusForId(id, status)
    }
}