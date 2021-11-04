package soeknad

import com.fasterxml.jackson.annotation.JsonValue
import no.nav.etterlatte.libs.common.soeknad.Spoersmaal
import no.nav.etterlatte.libs.common.soeknad.Valg


data class OmDenAvdoede(
    val foedselsnummer: String,
    val statsborgerskap: String,
    val boddEllerJobbetUtland: BoddEllerJobbetUtland?,
    val selvstendigNaeringsdrivende: Spoersmaal?,
    val haddePensjonsgivendeInntekt: Spoersmaal?,
    val harAvtjentMilitaerTjeneste: Spoersmaal?,
    val doedsfallAarsak: String?,
)

data class BoddEllerJobbetUtland(
    val svar: Valg,
    val oppholdUtland: List<OppholdUtland>?
)

data class OppholdUtland(
    val land: String,
    val fraDato: String,
    val tilDato: String?,
    val beskrivelse: List<String>,
    val medlemFolketrygd: Valg?,
    val mottokPensjon: MottokPensjon?,
)

enum class OppholdUtlandType(@get:JsonValue val beskrivelse: String) {
    bodd("oppholdUtlandType.bodd"),
    arbeidet("oppholdUtlandType.arbeidet"),
}

data class MottokPensjon(
    val beskrivelse: String?
)
