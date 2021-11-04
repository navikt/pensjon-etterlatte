package soeknad

import com.fasterxml.jackson.annotation.JsonValue
import no.nav.etterlatte.libs.common.soeknad.Valg


data class NySivilstatus(
    val sivilstatus: Sivilstatus,
    val samboerskap: NyttSamboerskap?,
)

enum class Sivilstatus(@get:JsonValue val sivilstatus: String) {
    ingen("nySivilstatus.ingen"),
    ekteskap("nySivilstatus.ekteskap"),
    samboerskap("nySivilstatus.samboerskap")
}

data class NyttSamboerskap(
    val hattBarnEllerVaertGift: Valg,
    val samboer: Samboer?,
)

data class Samboer(
    val fornavn: String,
    val etternavn: String,
    val foedselsnummer: String?,
    val harInntekt: HarInntekt?
)

data class HarInntekt(
    val svar: Valg,
    val inntektstype: List<SamboerInntektType>?,
    val samletBruttoinntektPrAar: String?,
)

enum class SamboerInntektType(@get:JsonValue val beskrivelse: String) {
    arbeidsinntekt("samboerInntekt.arbeidsinntekt"),
    pensjon("samboerInntekt.pensjon"),
    kapitalinntekt("samboerInntekt.kapitalinntekt"),
    andreYtelser("samboerInntekt.andreYtelser"),
}
