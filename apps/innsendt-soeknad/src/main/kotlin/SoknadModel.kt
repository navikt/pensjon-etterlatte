package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import java.time.LocalDateTime
import java.time.ZoneId

data class Innhold(
    val key: String,
    val spoersmaal: String,
    val svar: Any
)

data class Element(
    val tittel: String? = null,
    val innhold: List<Innhold>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Gruppe(
    val tittel: String,
    val elementer: List<Element>,
    val path: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Soeknad(
    var soeknadsType: SoeknadType?,
    val imageTag: String,
    val mottattDato: String = LocalDateTime.now(ZoneId.of("Europe/Oslo")).toString(),
    val oppsummering: List<Gruppe>
)

data class Soeker(val fnr: String, val type: SoeknadType)
private data class Barn(val fnr: String?, val soekerBarnepensjon: String?)

private fun Soeknad.finnBarn(): List<Barn> {
    val barnElementer: List<Element> = this.oppsummering
        .find { gruppe -> gruppe.path == "om-barn" }?.elementer ?: emptyList<Element>()
        .filter { elementer -> elementer.innhold.any { innhold -> innhold.key == "omBarn.foedselsnummer" } }

    return barnElementer.map { element ->
        Barn(
            element.innhold.find { innhold -> innhold.key == "omBarn.foedselsnummer" }?.svar.toString(),
            element.innhold.find { innhold -> innhold.key == "omBarn.barnepensjon.soeker" }?.svar.toString()
        )
    }
}

fun Soeknad.finnSoekere(gjenlevendeFnr: String): List<Soeker> = finnBarn()
    .filter { it.fnr != null && it.soekerBarnepensjon == "Ja" }
    .map { Soeker(it.fnr!!, SoeknadType.Barnepensjon) }
    .plus(Soeker(gjenlevendeFnr, SoeknadType.Gjenlevendepensjon))
