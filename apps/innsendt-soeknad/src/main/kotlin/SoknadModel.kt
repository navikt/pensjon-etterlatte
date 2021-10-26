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
    val elementer: List<Element>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Soeknad(
    var imageTag: String,
    var soeknadsType: SoeknadType?,
    val mottattDato: String = LocalDateTime.now(ZoneId.of("Europe/Oslo")).toString(),
    val oppsummering: List<Gruppe>
)

data class Soeker(val fnr: String, val type: SoeknadType)
