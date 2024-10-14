package no.nav.etterlatte.person

import no.nav.etterlatte.libs.common.person.Foedselsnummer

data class Person(
    val fornavn: String,
    val etternavn: String,
    val foedselsnummer: Foedselsnummer,
    val foedselsaar: Int? = null,
    val foedselsdato: String? = null,
)