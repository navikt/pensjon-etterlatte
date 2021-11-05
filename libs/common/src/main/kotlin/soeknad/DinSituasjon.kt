package soeknad

import com.fasterxml.jackson.annotation.JsonValue
import no.nav.etterlatte.libs.common.soeknad.Spoersmaal
import no.nav.etterlatte.libs.common.soeknad.Valg


data class DinSituasjon(
    val jobbStatus: List<JobbStatusType>,
    val ingenJobbBeskrivelse: String?,
    val utdanning: Utdanning?,
    val selvstendig: List<SelvstendigNaeringsdrivende>?,
    val arbeidsforhold: List<Arbeidsforhold>?,
    val andreYtelser: AndreYtelser?,
)

enum class JobbStatusType(@get:JsonValue val beskrivelse: String) {
    arbeidstaker("jobbStatus.arbeidstaker"),
    selvstendig("jobbStatus.selvstendig"),
    underUtdanning("jobbStatus.underUtdanning"),
    ingen("jobbStatus.ingen"),
}

data class Utdanning(
    val naavaerendeUtdanning: NaavaerendeUtdanning?,
    val hoyesteFullfoerteUtdanning: String?,
    val annenUtdanning: String?
)

data class NaavaerendeUtdanning(
    val navn: String?,
    val startDato: String?,
    val sluttDato: String?
)

data class SelvstendigNaeringsdrivende(
    val beskrivelse: String?,
    val orgnr: String?,
    val forventerEndretInntekt: Spoersmaal?
)


data class Arbeidsforhold(
    val arbeidsgiver: String?,
    val stilling: String?,
    val ansettelsesforhold: StillingType?,
    val stillingsprosent: String?,
    val forventerEndretInntekt: Spoersmaal?,
)

enum class StillingType(@get:JsonValue val beskrivelse: String) {
    fast("stillingType.fast"),
    midlertidig("stillingType.midlertidig"),
    sesongarbeid("stillingType.sesongarbeid")
}

data class AndreYtelser(
    val mottarAndreYtelser: Valg?,
    val kravOmAnnenStonad: Spoersmaal?,
    val annenPensjon: Spoersmaal?,
    val mottarPensjonUtland: MottarPensjonUtland?
)

data class MottarPensjonUtland(
    val svar: Valg?,
    val hvaSlagsPensjon: String?,
    val fraHvilketLand: String?,
    val bruttobeloepPrAar: String?,
    val landetsValuta: String?
)
