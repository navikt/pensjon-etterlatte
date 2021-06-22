package no.nav.etterlatte.person

import java.time.LocalDate

data class Person(
    val fornavn: String?,
    val etternavn: String?,
    val foedselsnummer: String?,
    val foedselsaar: Int?,
    val foedselsdato: LocalDate?,
    val adresse: String?,
    val statsborgerskap: String?,
    val sivilstatus: String?
)