package no.nav.etterlatte.libs.common.innsendtsoeknad.common

import com.fasterxml.jackson.annotation.JsonGetter
import com.fasterxml.jackson.annotation.JsonRawValue
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.core.util.RequestPayload
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.UtbetalingsInformasjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevendepensjon
import innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Spraak
import java.time.LocalDateTime

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = Gjenlevendepensjon::class, name = "GJENLEVENDEPENSJON"),
    JsonSubTypes.Type(value = Barnepensjon::class, name = "BARNEPENSJON")
)
interface InnsendtSoeknad {
    val versjon: String
    val spraak: Spraak
    val imageTag: ImageTag
    val type: SoeknadType
    val kilde: String
    val mottattDato: LocalDateTime
    val innsender: Innsender
    val soeker: Person
    val harSamtykket: Opplysning<Boolean>
    val utbetalingsInformasjon: BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon>?

    @JsonGetter("template")
    fun template(): String = "${type.name.lowercase()}_v$versjon"
}

/**
 * Docker Image Tag
 * Gjør det mulig å vite hvilken versjon
 */
typealias ImageTag = String

// Kan inneholde både gjenlevendepensjon og barnepensjon søknader.
data class SoeknadRequest(
    val soeknader: List<InnsendtSoeknad>
)