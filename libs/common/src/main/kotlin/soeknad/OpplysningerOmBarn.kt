package soeknad

import com.fasterxml.jackson.annotation.JsonValue
import no.nav.etterlatte.libs.common.soeknad.Valg


data class OpplysningerOmBarn(
    val barn: List<Barn> = emptyList(),
    val gravidEllerNyligFoedt: Valg
)

data class Barn(
    val fornavn: String,
    val etternavn: String,
    val foedselsnummer: String,
    val harBarnetVerge: HarBarnetVerge?,
    val relasjon: BarnRelasjonType?,
    val statsborgerskap: String?,
    val bosattUtland: BosattUtland?,
    val dagligOmsorg: Valg?,
    val barnepensjon: Barnepensjon?
)

data class HarBarnetVerge(
    val svar: Valg,
    val fornavn: String?,
    val etternavn: String?,
    val foedselsnummer: String?
)

enum class BarnRelasjonType(@get:JsonValue val beskrivelse: String) {
    fellesbarnMedAvdoede("barnRelasjon.fellesbarnMedAvdoede"),
    avdoedesSaerkullsbarn("barnRelasjon.avdoedesSaerkullsbarn"),
    egneSaerkullsbarn("barnRelasjon.egneSaerkullsbarn"),
}

data class BosattUtland(
    val svar: Valg,
    val land: String?,
    val adresse: String?
)

data class Barnepensjon(
    val soeker: Valg?,
    val kontonummer: Kontonummer?,
    val forskuddstrekk: Forskuddstrekk?,
)

data class Kontonummer(
    val svar: Valg,
    val kontonummer: String?
)

data class Forskuddstrekk(
    val svar: Valg,
    val trekkprosent: String?
)
