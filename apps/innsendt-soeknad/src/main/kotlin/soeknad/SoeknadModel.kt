package soeknad

typealias SoeknadID = Long

data class LagretSoeknad(
    val id: SoeknadID,
    val fnr: String,
    val payload: String
)

data class UlagretSoeknad(
    val fnr: String,
    val payload: String
)

typealias StatusID = Int

enum class Status(
    val id: StatusID
) {
    LAGRETKLADD(1),
    FERDIGSTILT(2),
    SENDT(3),
    ARKIVERT(4),
    ARKIVERINGSFEIL(5),
    SLETTET(6),
    UTGAATT(7);

    companion object {
        /**
         * Alle Status-IDer som ikke er [LAGRETKLADD]
         */
        val innsendt = listOf(FERDIGSTILT, SENDT, ARKIVERT, ARKIVERINGSFEIL)

        /**
         * Ekstraherer status-IDer til en sql-lesbar string.
         */
        fun List<Status>.toSqlString(): String = joinToString { it.id.toString() }
    }
}