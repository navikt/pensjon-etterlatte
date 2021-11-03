package no.nav.etterlatte.libs.common.soeknad

import com.fasterxml.jackson.annotation.JsonValue

enum class Valg(@get:JsonValue val valg: String) {
    JA("Ja"),
    NEI("Nei"),
    VET_IKKE("Vet ikke"),
}

data class Spoersmaal(
    val svar: Valg,
    val beskrivelse: String?
)
