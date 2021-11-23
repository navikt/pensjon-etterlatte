package soknad

import no.nav.etterlatte.libs.common.soeknad.Soeknad
import no.nav.etterlatte.soknad.barnAdressefelter
import no.nav.etterlatte.soknad.utenAdresseFor
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import soeknad.SoeknadFixtures

internal class AdressebeskyttelseUtilsKtTest {
    private val soeknad = SoeknadFixtures.soeknadMedBarnBosattUtland
    private val barn = soeknad.utfyltSoeknad.opplysningerOmBarn.barn.map { it.foedselsnummer }

    @Test
    fun `Skal fjerne informasjon om bosatt utland og adresse for barn med adressebeskyttelse`() {
        assertNotNull(soeknad.utfyltSoeknad.opplysningerOmBarn.barn[0].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(soeknad, barn[0]))

        assertNotNull(soeknad.utfyltSoeknad.opplysningerOmBarn.barn[1].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(soeknad, barn[1]))

        assertNotNull(soeknad.utfyltSoeknad.opplysningerOmBarn.barn[2].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(soeknad, barn[2]))

        val rensketSoeknad = soeknad utenAdresseFor barn.take(2)

        assertNull(rensketSoeknad.utfyltSoeknad.opplysningerOmBarn.barn[0].bosattUtland)
        assertFalse(harAdresseinformasjonIOppsummering(rensketSoeknad, barn[0]))

        assertNull(rensketSoeknad.utfyltSoeknad.opplysningerOmBarn.barn[1].bosattUtland)
        assertFalse(harAdresseinformasjonIOppsummering(rensketSoeknad, barn[1]))

        assertNotNull(rensketSoeknad.utfyltSoeknad.opplysningerOmBarn.barn[2].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(rensketSoeknad, barn[2]))
    }


    @Test
    fun `Skal beholde informasjon om bosatt utland og adresse for barn uten adressebeskyttelse`() {
        val rensketSoeknad = soeknad utenAdresseFor listOf("ikke_gyldig", "ingen_treff")

        assertNotNull(rensketSoeknad.utfyltSoeknad.opplysningerOmBarn.barn[0].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(rensketSoeknad, barn[0]))

        assertNotNull(rensketSoeknad.utfyltSoeknad.opplysningerOmBarn.barn[1].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(rensketSoeknad, barn[1]))

        assertNotNull(rensketSoeknad.utfyltSoeknad.opplysningerOmBarn.barn[2].bosattUtland)
        assertTrue(harAdresseinformasjonIOppsummering(rensketSoeknad, barn[2]))
    }

    private fun harAdresseinformasjonIOppsummering(soeknad: Soeknad, fnr: String): Boolean =
        soeknad.oppsummering
            .filter { it.path == "om-barn" }
            .mapNotNull { it.elementer.find { element -> element.innhold.any { innhold -> innhold.svar == fnr } } }
            .any { element ->
                element.innhold.any { innhold -> innhold.key in barnAdressefelter && innhold.svar != "<Fjernet på grunn av adressesperring>" }
            }
}
