package no.nav.etterlatte.person.pdl

import java.time.LocalDate
import java.time.LocalDateTime

data class Person(
    val navn: List<Navn>,
    val foedsel: List<Foedsel>,
)

data class Navn(
    val fornavn: String,
    val mellomnavn: String? = null,
    val etternavn: String,
    val folkeregistermetadata: Folkeregistermetadata? = null,
    val metadata: Metadata,
)

data class Foedsel(
    val foedselsdato: LocalDate? = null,
    val foedselsaar: Int? = null,
    val folkeregistermetadata: Folkeregistermetadata? = null,
    val metadata: Metadata,
)

data class Folkeregistermetadata(
    val gyldighetstidspunkt: LocalDateTime? = null,
)

data class Metadata(
    val endringer: List<Endring>,
    val historisk: Boolean,
    val master: String,
    val opplysningsId: String,
) {
    fun sisteRegistrertDato(): LocalDateTime = endringer.maxByOrNull { it.registrert }?.registrert!!
}

data class Endring(
    val kilde: String,
    val registrert: LocalDateTime,
    val registrertAv: String,
    val systemkilde: String,
    val type: Endringstype,
)

enum class Endringstype {
    KORRIGER,
    OPPHOER,
    OPPRETT,
}