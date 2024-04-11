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
import org.junit.jupiter.api.Test


internal class JournalfoerendeEnhetServiceKtTest {
    private val gjenlevendepMedOppholdAvtaleland = InnsendtSoeknadFixtures.gjenlevendepensjon()
    private val barnepMedOppholdAvtaleland = InnsendtSoeknadFixtures.barnepensjon()

    private val avdoedUtenOppholdAvtaleland = gjenlevendepMedOppholdAvtaleland.avdoed.copy(
        utenlandsopphold = BetingetOpplysning(svar = EnumSvar(JaNeiVetIkke.NEI, "Nei"), null, null)
    )

    private val gjenlevendepUtenOppholdUtland = gjenlevendepMedOppholdAvtaleland.copy(
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
        finnJournalfoerendeEnhet(gjenlevendepUtenOppholdUtland, UGRADERT) shouldBe null
        finnJournalfoerendeEnhet(barnepUtenOppholdUtland, UGRADERT) shouldBe null
    }

    @Test
    fun `Skal returnere null dersom søknaden ikke har adressesperre og avdød ikke har opphold i avtaleland`() {
        finnJournalfoerendeEnhet(gjenlevendepMedOppholdAvtaleland.copy(
            avdoed = gjenlevendepMedOppholdAvtaleland.avdoed.copy(
                utenlandsopphold = gjenlevendepMedOppholdAvtaleland.avdoed.utenlandsopphold.copy(
                    opplysning = gjenlevendepMedOppholdAvtaleland.avdoed.utenlandsopphold.opplysning!!.map {
                        it.copy(land = Opplysning(FritekstSvar("Tanzania")))
                    }
                )
            )
        ), UGRADERT) shouldBe null

        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland.copy(
            foreldre = listOf(gjenlevendepMedOppholdAvtaleland.avdoed.copy(
                utenlandsopphold = gjenlevendepMedOppholdAvtaleland.avdoed.utenlandsopphold.copy(
                    opplysning = gjenlevendepMedOppholdAvtaleland.avdoed.utenlandsopphold.opplysning!!.map {
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
        finnJournalfoerendeEnhet(gjenlevendepMedOppholdAvtaleland, UGRADERT) shouldBe ENHET_UTLAND
        finnJournalfoerendeEnhet(gjenlevendepMedOppholdAvtaleland, FORTROLIG) shouldBe ENHET_UTLAND
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, UGRADERT) shouldBe ENHET_UTLAND
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, FORTROLIG) shouldBe ENHET_UTLAND
    }

    @Test
    fun `Skal rutes til vikafossen uansett dersom søknaden har gradering STRENGT_FORTROLIG`() {
        finnJournalfoerendeEnhet(gjenlevendepUtenOppholdUtland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(gjenlevendepMedOppholdAvtaleland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepUtenOppholdUtland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, STRENGT_FORTROLIG) shouldBe ENHET_VIKAFOSSEN
    }

    @Test
    fun `Skal rutes til vikafossen uansett dersom søknaden har gradering STRENGT_FORTROLIG_UTLAND`() {
        finnJournalfoerendeEnhet(gjenlevendepUtenOppholdUtland, STRENGT_FORTROLIG_UTLAND) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(gjenlevendepMedOppholdAvtaleland, STRENGT_FORTROLIG_UTLAND) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepUtenOppholdUtland, STRENGT_FORTROLIG_UTLAND) shouldBe ENHET_VIKAFOSSEN
        finnJournalfoerendeEnhet(barnepMedOppholdAvtaleland, STRENGT_FORTROLIG_UTLAND) shouldBe ENHET_VIKAFOSSEN
    }
}
