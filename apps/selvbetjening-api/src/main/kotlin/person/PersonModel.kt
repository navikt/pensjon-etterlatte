package no.nav.etterlatte.person

data class Person(
    val fornavn: String?,
    val etternavn: String?,
    val foedselsnummer: String?,
    val foedselsaar: Int?,
    val foedselsdato: String?,
    val adresse: String?,
    val husnummer: String?,
    val husbokstav: String?,
    val postnummer: String?,
    val poststed: String?,
    val statsborgerskap: String?,
    val sivilstatus: String?
)