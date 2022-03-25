package no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Kontaktinfo
import no.nav.etterlatte.libs.common.innsendtsoeknad.UtbetalingsInformasjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.BetingetOpplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.ImageTag
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Innsender
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Person
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.PersonType
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Spraak
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.EnumSvar
import java.time.LocalDateTime

@JsonIgnoreProperties(ignoreUnknown = true)
data class Barnepensjon(
    override val imageTag: ImageTag,
    override val spraak: Spraak,
    override val innsender: Innsender,
    override val harSamtykket: Opplysning<Boolean>,
    override val utbetalingsInformasjon: BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon>?,
    override val soeker: Barn,
    val foreldre: List<Person>,
    val soesken: List<Barn>
) : InnsendtSoeknad {
    override val versjon = "2"
    override val type = SoeknadType.BARNEPENSJON
    override val mottattDato: LocalDateTime = LocalDateTime.now()

    init {
        requireNotNull(versjon) { "Versjon av søknaden må være satt"}
        requireNotNull(type)
        requireNotNull(mottattDato)
    }
}

data class GjenlevendeForelder(
    override val fornavn: Opplysning<String>,
    override val etternavn: Opplysning<String>,
    override val foedselsnummer: Opplysning<Foedselsnummer>,

    val adresse: Opplysning<String>,
    val statsborgerskap: Opplysning<String>,
    val kontaktinfo: Kontaktinfo,
) : Person {
    override val type = PersonType.GJENLEVENDE_FORELDER
}
