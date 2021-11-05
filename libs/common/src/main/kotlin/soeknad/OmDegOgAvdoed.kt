package soeknad

import com.fasterxml.jackson.annotation.JsonValue
import no.nav.etterlatte.libs.common.soeknad.Valg


data class OmDegOgAvdoed(
    val avdoed: Avdoed,
    val forholdTilAvdoede: ForholdTilAvdoede,
    val nySivilstatus: NySivilstatus
)

data class Avdoed(
    val datoForDoedsfallet: String,
    val etternavn: String,
    val fornavn: String
)

data class ForholdTilAvdoede(
    val relasjon: ForholdTilAvdoedeType,
    val datoForInngaattPartnerskap: String?,
    val datoForSkilsmisse: String?,
    val datoForInngaattSamboerskap: String?,
    val datoForSamlivsbrudd: String?,
    val fellesBarn: Valg?,
    val samboereMedFellesBarn: Valg?,
    val omsorgForBarn: Valg?,
    val tidligereGift: Valg?,
    val mottokBidrag: Valg?,
    val mottokEktefelleBidrag: Valg?
)

enum class ForholdTilAvdoedeType(@get:JsonValue val relasjon: String) {
    gift("avdoede.relasjon.gift"),
    separert("avdoede.relasjon.separert"),
    samboer("avdoede.relasjon.samboer"),
    skilt("avdoede.relasjon.skilt"),
    tidligereSamboer("avdoede.relasjon.tidligereSamboer")
}
