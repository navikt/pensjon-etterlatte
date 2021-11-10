package no.nav.etterlatte.libs.common.soeknad

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

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
