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
}