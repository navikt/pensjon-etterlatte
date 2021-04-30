package no.nav.etterlatte.person.model

/**
 * [ResponseError] from GraphQL.
 */
internal data class ResponseError(
        val message: String?,
        val locations: List<ErrorLocation>? = null,
        val path: List<String>? = null,
        val extensions: ErrorExtension? = null
)

internal data class ErrorLocation(
        val line: String?,
        val column: String?
)

internal data class ErrorExtension(
        val code: String?,
        val details: ErrorDetails?,
        val classification: String?
)

internal data class ErrorDetails(
        val type: String? = null,
        val cause: String? = null,
        val policy: String? = null
)
