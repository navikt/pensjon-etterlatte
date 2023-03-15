package dokarkiv

data class JournalpostRequest(
    val tittel: String,
    val tema: String,
    val journalpostType: JournalPostType,
    val behandlingstema: String,
    val journalfoerendeEnhet: String?,
    val avsenderMottaker: AvsenderMottaker,
    val bruker: Bruker,
    val eksternReferanseId: String,
    val sak: Sak? = null,
    var dokumenter: List<JournalpostDokument>
) {
    val kanal: String = "NAV_NO"
}

data class AvsenderMottaker(
    val id: String,
    val idType: String = "FNR",
    val navn: String = ""
)

data class Bruker(
    val id: String,
    val idType: String = "FNR"
)

data class JournalpostDokument(
    val tittel: String,
    val dokumentKategori: DokumentKategori,
    val brevkode: String = "XX.YY-ZZ",
    val dokumentvarianter: List<DokumentVariant>
)

data class Sak (
    val fagsakId: String,
    val sakstype: String = "FAGSAK",
    val fagsaksystem: String = "EY"
)

sealed class DokumentVariant {
    abstract val filtype: String
    abstract val fysiskDokument: String
    abstract val variantformat: String

    data class ArkivPDF(
        override val fysiskDokument: String,
    ) : DokumentVariant() {
        override val filtype: String = "PDFA"
        override val variantformat: String = "ARKIV"
    }

    data class OriginalJson(
        override val fysiskDokument: String,
    ) : DokumentVariant() {
        override val filtype: String = "JSON"
        override val variantformat: String = "ORIGINAL"
    }
}

enum class JournalPostType(val type: String) {
    INNGAAENDE("INNGAAENDE"),
    UTGAAENDE("UTGAAENDE")
}

enum class DokumentKategori(val type: String) {
    SOK("SOK"),
    VB("VB"),
    IB("IB")
}
