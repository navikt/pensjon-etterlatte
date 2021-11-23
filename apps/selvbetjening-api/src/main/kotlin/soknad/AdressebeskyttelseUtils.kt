package no.nav.etterlatte.soknad

import no.nav.etterlatte.libs.common.soeknad.Innhold
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import no.nav.etterlatte.libs.common.soeknad.Valg
import soeknad.BosattUtland

internal val barnAdressefelter = listOf("omBarn.bosattUtland.svar", "omBarn.bosattUtland.land", "omBarn.bosattUtland.adresse")

/**
 * Funksjonen fjerner informasjon om bosatt utland og adresse i utfylt søknad og oppsummering for en gitt søknad.
 */
internal infix fun Soeknad.utenAdresseFor(fnrListe: List<String>): Soeknad = this.copy(
    utfyltSoeknad = this.utfyltSoeknad.copy(
        opplysningerOmBarn = this.utfyltSoeknad.opplysningerOmBarn.copy(
            barn = this.utfyltSoeknad.opplysningerOmBarn.barn.map { barn ->
                if (barn.foedselsnummer in fnrListe) barn.copy(bosattUtland = null)
                else barn
            }
        ),
    ),
    oppsummering = this.oppsummering.map { gruppe ->
        if (gruppe.path == "om-barn") {
            gruppe.copy(elementer = gruppe.elementer.map { elementer ->
                if (fnrListe.contains(elementer.innhold.find { it.key == "omBarn.foedselsnummer" }?.svar)) {
                    elementer.copy(innhold = elementer.innhold.map { innhold ->
                        if (innhold.key in barnAdressefelter) {
                            Innhold(innhold.key, innhold.spoersmaal, "<Fjernet på grunn av adressesperring>")
                        }
                        else innhold
                    })
                } else elementer
            })
        } else gruppe
    }
)
