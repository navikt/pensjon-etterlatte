package no.nav.etterlatte.person.pdl

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import no.nav.etterlatte.pdl.ResponseError
import java.time.LocalDate
import java.time.LocalDateTime

@JsonIgnoreProperties(ignoreUnknown = true)
data class PersonResponse(
    val data: PersonResponseData? = null,
    val errors: List<ResponseError>? = null,
)

data class PersonResponseData(
    val hentPerson: HentPerson? = null,
)

data class HentPerson(
    val navn: List<Navn>,
    val foedselsdato: List<Foedselsdato>,
)

data class Navn(
    val fornavn: String,
    val mellomnavn: String? = null,
    val etternavn: String,
    val folkeregistermetadata: Folkeregistermetadata? = null,
    val metadata: Metadata,
)

data class Foedselsdato(
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