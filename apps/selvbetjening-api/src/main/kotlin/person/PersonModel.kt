package no.nav.etterlatte.person

import no.nav.etterlatte.libs.common.person.Foedselsnummer

data class Person(
    val fornavn: String,
    val etternavn: String,
    val foedselsnummer: Foedselsnummer,
    val foedselsaar: Int? = null,
    val foedselsdato: String? = null,
    val adressebeskyttelse: Boolean,
    val adresse: String? = null,
    val husnummer: String? = null,
    val husbokstav: String? = null,
    val postnummer: String? = null,
    val poststed: String? = null,
    val statsborgerskap: String? = null,
    val sivilstatus: String? = null,
    val telefonnummer: String? = null,
    val spraak: String? = null
)
