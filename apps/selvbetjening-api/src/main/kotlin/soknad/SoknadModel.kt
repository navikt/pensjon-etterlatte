package no.nav.etterlatte.soknad

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

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

typealias Soeknad = MutableList<Gruppe>

fun Soeknad.validate() {
    if (this.isEmpty())
        throw Exception("Søknad mangler grupper")
    else if (this.size < 5)
        throw Exception("Søknad inneholder færre grupper enn forventet")
    else if (this.size > 5)
        throw Exception("Søknad inneholder flere grupper enn forventet")
    else {
        this.forEach { gruppe ->
            if (gruppe.tittel.isBlank())
                throw Exception("Søknad inneholder gruppe uten tittel")
            else if (gruppe.elementer.isEmpty())
                throw Exception("Søknad inneholder gruppe uten underelementer")
        }
    }
}
