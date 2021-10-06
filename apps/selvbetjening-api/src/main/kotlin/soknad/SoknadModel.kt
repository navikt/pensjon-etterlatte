package no.nav.etterlatte.soknad

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDateTime
import java.time.ZoneId

data class Innhold(
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
    val elementer: List<Element>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Soeknad(
    val imageTag: String,
    val mottattDato: String = LocalDateTime.now(ZoneId.of("Europe/Oslo")).toString(),
    val oppsummering: List<Gruppe>
)

fun Soeknad.validate() {
    val oppsummering = this.oppsummering

    if (oppsummering.isEmpty())
        throw Exception("Søknad mangler grupper")
    else if (oppsummering.size < 5)
        throw Exception("Søknad inneholder færre grupper enn forventet")
    else if (oppsummering.size > 5)
        throw Exception("Søknad inneholder flere grupper enn forventet")
    else {
        oppsummering.forEach { gruppe ->
            if (gruppe.tittel.isBlank())
                throw Exception("Søknad inneholder gruppe uten tittel")
            else if (gruppe.elementer.isEmpty())
                throw Exception("Søknad inneholder gruppe uten underelementer")
        }
    }
}
