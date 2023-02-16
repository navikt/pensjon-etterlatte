package no.nav.etterlatte.dokarkiv

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.ktor.http.HttpStatusCode

data class DokarkivDokument(
    val dokumentInfoId: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class DokarkivResponse(
    val journalpostId: String,
    val journalpoststatus: String? = null,
    val melding: String? = null,
    val journalpostferdigstilt: Boolean,
    val dokumenter: List<DokarkivDokument> = emptyList()
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class DokarkivErrorResponse(
    val status: HttpStatusCode,
    val error: String? = null,
    val message: String? = null,
    val path: String? = null
)
