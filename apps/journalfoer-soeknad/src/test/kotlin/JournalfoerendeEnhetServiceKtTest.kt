import io.kotest.matchers.shouldBe
import no.nav.etterlatte.Konstanter.ENHET_UTLAND
import no.nav.etterlatte.Konstanter.ENHET_VIKAFOSSEN
import no.nav.etterlatte.finnJournalfoerendeEnhet
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.GjenlevendeForelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.BetingetOpplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.EnumSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.FritekstSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.pdl.Gradering.FORTROLIG
import no.nav.etterlatte.libs.pdl.Gradering.STRENGT_FORTROLIG
import no.nav.etterlatte.libs.pdl.Gradering.STRENGT_FORTROLIG_UTLAND
import no.nav.etterlatte.libs.pdl.Gradering.UGRADERT
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.libs.utils.test.avdoedMedUtenlandsopphold
import org.junit.jupiter.api.Test


internal class JournalfoerendeEnhetServiceKtTest {
    private val omstillingsstoenadMedOppholdAvtaleland =
        InnsendtSoeknadFixtures.omstillingsSoeknad(avdoed = avdoedMedUtenlandsopphold())

    private val barnepMedOppholdAvtaleland = InnsendtSoeknadFixtures.barnepensjon()

    private val avdoedUtenOppholdAvtaleland = omstillingsstoenadMedOppholdAvtaleland.avdoed.copy(
        utenlandsopphold = BetingetOpplysning(svar = EnumSvar(JaNeiVetIkke.NEI, "Nei"), null, null)
    )

    private val omstillingsstoenadUtenOppholdUtland = omstillingsstoenadMedOppholdAvtaleland.copy(
        avdoed = avdoedUtenOppholdAvtaleland
    )
    private val barnepUtenOppholdUtland = barnepMedOppholdAvtaleland.copy(
        foreldre = listOf(
            avdoedUtenOppholdAvtaleland,
            barnepMedOppholdAvtaleland.foreldre.find { it is GjenlevendeForelder }!!
        )
    )

    @Test
    fun `Skal returnere null dersom søknaden ikke har adressesperre og avdød ikke har opphold i utlandet`() {
        finnJournalfoerendeEnhet(omstillingsstoenadUtenOppholdUtland, UGRADERT) shouldBe null
        finnJournalfoerendeEnhet(barnepUtenOppholdUtland, UGRADERT) shouldBe null
    }

    @Test
    fun `Skal returnere null dersom søknaden ikke har adressesperre og avdød ikke har opphold i avtaleland`() {
        finnJournalfoerendeEnhet(omstillingsstoenadMedOppholdAvtaleland.copy(
            avdoed = omstillingsstoenadMedOppholdAvtaleland.avdoed.copy(
                utenlandsopphold = omstillingsstoenadMedOppholdAvtaleland.avdoed.utenlandsopphold.copy(
                    opplysning = omstillingsstoenadMedOppholdAvtaleland.avdoed.utenlandsopphold.opplysning!!.map {
                        it.copy(land = Opplysning(FritekstSvar("Tanzania")))
                    }
                )
            )
        ), UGRADERT) shouldBe null

        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland.copy(
            foreldre = listOf(omstillingsstoenadMedOppholdAvtaleland.avdoed.copy(
                utenlandsopphold = omstillingsstoenadMedOppholdAvtaleland.avdoed.utenlandsopphold.copy(
                    opplysning = omstillingsstoenadMedOppholdAvtaleland.avdoed.utenlandsopphold.opplysning!!.map {
                        it.copy(land = Opplysning(FritekstSvar("Tanzania")))
                    }
                )),
                barnepMedOppholdAvtaleland.foreldre.find { it is GjenlevendeForelder }!!
            )
        ), UGRADERT
        ) shouldBe null
    }

    @Test
    fun `Skal rutes til NFP UTLAND ÅLESUND dersom avdød har har opphold i avtaleland og det ikke er adressesperre`() {
        finnJournalfoerendeEnhet(omstillingsstoenadMedOppholdAvtaleland, UGRADERT) shouldBe ENHET_UTLAND
        finnJournalfoerendeEnhet(omstillingsstoenadMedOppholdAvtaleland, FORTROLIG) shouldBe ENHET_UTLAND
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, UGRADERT) shouldBe ENHET_UTLAND
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, FORTROLIG) shouldBe ENHET_UTLAND
    }

    @Test
    fun `Skal rutes til vikafossen uansett dersom søknaden har gradering STRENGT_FORTROLIG`() {
        finnJournalfoerendeEnhet(omstillingsstoenadUtenOppholdUtland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(omstillingsstoenadMedOppholdAvtaleland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepUtenOppholdUtland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
    }

    @Test
    fun `Skal rutes til vikafossen uansett dersom søknaden har gradering STRENGT_FORTROLIG_UTLAND`() {
        finnJournalfoerendeEnhet(
            omstillingsstoenadUtenOppholdUtland,
            STRENGT_FORTROLIG_UTLAND
        ) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(
            omstillingsstoenadMedOppholdAvtaleland,
            STRENGT_FORTROLIG_UTLAND
        ) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepUtenOppholdUtland, STRENGT_FORTROLIG_UTLAND) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, STRENGT_FORTROLIG_UTLAND) shouldBe ENHET_VIKAFOSSEN
    }
}
