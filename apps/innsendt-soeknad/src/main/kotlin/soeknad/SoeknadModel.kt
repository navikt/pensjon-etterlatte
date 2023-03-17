package soeknad

import com.fasterxml.jackson.annotation.JsonIgnore
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType

typealias SoeknadID = Long

data class FerdigstiltSoeknad(
    val id: SoeknadID,
    val type: SoeknadType? = null,
    val kilde: String? = null
)

data class LagretSoeknad(
    val id: SoeknadID,
    val fnr: String,
    val payload: String
) {
    @JsonIgnore
    var status: Status? = null
}

data class UlagretSoeknad(
    val fnr: String,
    val payload: String,
    val kilde: String,
    val type: SoeknadType? = null
)

data class RapportLinje(
    val status: Status,
    val kilde: String,
    val count: String
)

enum class Status {
    LAGRETKLADD,
    FERDIGSTILT,
    SENDT,
    ARKIVERT,
    ARKIVERINGSFEIL,
    KONVERTERT,
    SLETTET,
    UTGAATT,
    SAKID_REGISTRERT,
    BEHANDLING_LAGET,
    ;

    companion object {
        /**
         * Alle Status-IDer som indikerer at en søknad er innsendt og under maskinelt arbeid
         */
        val innsendt = listOf(FERDIGSTILT, SENDT, ARKIVERT, ARKIVERINGSFEIL, SAKID_REGISTRERT, BEHANDLING_LAGET)
    }
}

fun List<Status>.toSqlString() = joinToString { "'$it'" }
