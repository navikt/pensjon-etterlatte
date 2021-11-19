package soeknad

import com.fasterxml.jackson.annotation.JsonIgnore
import no.nav.etterlatte.libs.common.soeknad.SoeknadType

typealias SoeknadID = Long

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
    val payload: String
)

data class Soeker(
    val fnr: String,
    val type: SoeknadType
)

enum class Status {
    LAGRETKLADD,
    FERDIGSTILT,
    SENDT,
    ARKIVERT,
    ARKIVERINGSFEIL,
    SLETTET,
    UTGAATT;

    companion object {
        /**
         * Alle Status-IDer som indikerer at en søknad er innsendt og under maskinelt arbeid
         */
        val innsendt = listOf(FERDIGSTILT, SENDT, ARKIVERT, ARKIVERINGSFEIL)
    }
}

fun List<Status>.toSqlString() = joinToString { "'$it'" }
