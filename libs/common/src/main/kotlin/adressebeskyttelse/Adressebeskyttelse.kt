package no.nav.etterlatte.libs.common.adressebeskyttelse


object Adressebeskyttelse {
    const val KODE6 ="STRENGT_FORTROLIG"
    const val KODE7 = "FORTROLIG"
    const val KODE19 = "STRENGT_FORTROLIG_UTLAND"
    const val INGENBESKYTTELSE = "INGEN_BESKYTTELSE"
}

enum class Graderinger (val ruting: String) {
    STRENGT_FORTROLIG("2103"),
    STRENGT_FORTROLIG_UTLAND("2103"),
    FORTROLIG("4817"),
    INGEN_BESKYTTELSE ("4817")
}