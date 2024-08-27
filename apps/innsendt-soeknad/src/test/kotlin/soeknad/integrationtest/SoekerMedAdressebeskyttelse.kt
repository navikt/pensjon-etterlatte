package soeknad.integrationtest

import SoeknadIntegrationTest
import apiTestModule
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.coEvery
import no.nav.etterlatte.deserialize
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.innsendtsoeknad.omstillingsstoenad.Omstillingsstoenad
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.libs.utils.test.eksempelBarn
import no.nav.etterlatte.pdl.Gradering
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.etterlatte.toJson
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import tokenFor

@DisplayName("Innsender av søknad har barn med adressebeskyttelse")
internal class SoekerMedAdressebeskyttelse : SoeknadIntegrationTest() {
    companion object {
        private const val INNSENDER = "19468741094"
        private const val BARN_STRENGT_FORTROLIG = "21461297037"
        private const val BARN_STRENGT_FORTROLIG_UTLAND = "05111850870"
        private const val BARN_UGRADERT = "10459829453"
        private const val AVDOED = "16448705149"
    }

    @Test
    fun `Barnepensjon soeknad skjuler barn med adressebeskyttelse`() {
        val soeknadRequest =
            SoeknadRequest(
                listOf(
                    InnsendtSoeknadFixtures.barnepensjon(
                        innsenderFnr = Foedselsnummer.of(INNSENDER),
                        soekerFnr = Foedselsnummer.of(BARN_UGRADERT),
                        avdoed = Foedselsnummer.of(AVDOED),
                        soesken =
                            listOf(
                                Foedselsnummer.of(BARN_STRENGT_FORTROLIG),
                                Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND),
                            ),
                    ),
                    InnsendtSoeknadFixtures.barnepensjon(
                        innsenderFnr = Foedselsnummer.of(INNSENDER),
                        soekerFnr = Foedselsnummer.of(BARN_STRENGT_FORTROLIG),
                        avdoed = Foedselsnummer.of(AVDOED),
                        soesken =
                            listOf(
                                Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND),
                                Foedselsnummer.of(BARN_UGRADERT),
                            ),
                    ),
                    InnsendtSoeknadFixtures.barnepensjon(
                        innsenderFnr = Foedselsnummer.of(INNSENDER),
                        soekerFnr = Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND),
                        avdoed = Foedselsnummer.of(AVDOED),
                        soesken =
                            listOf(
                                Foedselsnummer.of(BARN_STRENGT_FORTROLIG),
                                Foedselsnummer.of(BARN_UGRADERT),
                            ),
                    ),
                ),
            )

        soeknadRequest.soeknader.forEach {
            (it as Barnepensjon).soeker.utenlandsAdresse shouldNotBe null
        }

        coEvery {
            adressebeskyttelse.hentGradering(
                listOf(
                    Foedselsnummer.of(BARN_STRENGT_FORTROLIG),
                    Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND),
                    Foedselsnummer.of(BARN_UGRADERT),
                ),
                SoeknadType.BARNEPENSJON,
            )
        } returns
            mapOf(
                Foedselsnummer.of(BARN_STRENGT_FORTROLIG) to Gradering.STRENGT_FORTROLIG,
                Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND) to Gradering.STRENGT_FORTROLIG_UTLAND,
                Foedselsnummer.of(BARN_UGRADERT) to Gradering.UGRADERT,
            )

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(INNSENDER)
                setBody(soeknadRequest.toJson())
            }
        }.apply {
            response.status() shouldBe HttpStatusCode.OK
        }

        BARN_STRENGT_FORTROLIG.let { strengtFortrolig ->
            val row =
                dsbHolder.dataSource.connection
                    .createStatement()
                    .executeQuery("SELECT * FROM innhold WHERE fnr = '$strengtFortrolig'")
            row.next()

            row.getString("fnr") shouldBe strengtFortrolig
            val soeknad = deserialize<Barnepensjon>(row.getString("payload"))
            soeknad.soeker.utenlandsAdresse shouldBe null
        }

        BARN_STRENGT_FORTROLIG_UTLAND.let { strengtFortroligUtland ->
            val row =
                dsbHolder.dataSource.connection
                    .createStatement()
                    .executeQuery("SELECT * FROM innhold WHERE fnr = '$strengtFortroligUtland'")
            row.next()

            row.getString("fnr") shouldBe strengtFortroligUtland
            val soeknad = deserialize<Barnepensjon>(row.getString("payload"))
            soeknad.soeker.utenlandsAdresse shouldBe null
        }

        BARN_UGRADERT.let { ugradert ->
            val row =
                dsbHolder.dataSource.connection
                    .createStatement()
                    .executeQuery("SELECT * FROM innhold WHERE fnr = '$ugradert'")
            row.next()

            row.getString("fnr") shouldBe ugradert
            val soeknad = deserialize<Barnepensjon>(row.getString("payload"))
            soeknad.soeker.utenlandsAdresse shouldNotBe null
        }
    }

    @Test
    fun `OMS soeknad skjuler barn med adressebeskyttelse`() {
        val soeknadRequest =
            SoeknadRequest(
                listOf(
                    InnsendtSoeknadFixtures.omstillingsSoeknad(
                        innsenderFnr = Foedselsnummer.of(INNSENDER),
                        avdoed = Foedselsnummer.of(AVDOED),
                        barn =
                            listOf(
                                eksempelBarn(Foedselsnummer.of(BARN_STRENGT_FORTROLIG)),
                                eksempelBarn(Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND)),
                                eksempelBarn(Foedselsnummer.of(BARN_UGRADERT)),
                            ),
                    ),
                ),
            )

        (soeknadRequest.soeknader.single() as Omstillingsstoenad).barn.forEach {
            it.utenlandsAdresse shouldNotBe null
        }

        coEvery {
            adressebeskyttelse.hentGradering(
                listOf(
                    Foedselsnummer.of(BARN_STRENGT_FORTROLIG),
                    Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND),
                    Foedselsnummer.of(BARN_UGRADERT),
                ),
                SoeknadType.OMSTILLINGSSTOENAD,
            )
        } returns
            mapOf(
                Foedselsnummer.of(BARN_STRENGT_FORTROLIG) to Gradering.STRENGT_FORTROLIG,
                Foedselsnummer.of(BARN_STRENGT_FORTROLIG_UTLAND) to Gradering.STRENGT_FORTROLIG_UTLAND,
                Foedselsnummer.of(BARN_UGRADERT) to Gradering.UGRADERT,
            )

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(INNSENDER)
                setBody(soeknadRequest.toJson())
            }
        }.apply {
            response.status() shouldBe HttpStatusCode.OK
        }

        INNSENDER.let { OmsSoeker ->
            val row =
                dsbHolder.dataSource.connection
                    .createStatement()
                    .executeQuery("SELECT * FROM innhold WHERE fnr = '$OmsSoeker'")
            row.next()

            row.getString("fnr") shouldBe OmsSoeker
            val soeknad = deserialize<Omstillingsstoenad>(row.getString("payload"))

            soeknad.barn.find { it.foedselsnummer!!.svar.value == BARN_STRENGT_FORTROLIG }!!.utenlandsAdresse shouldBe
                null
            soeknad.barn
                .find {
                    it.foedselsnummer!!.svar.value == BARN_STRENGT_FORTROLIG_UTLAND
                }!!
                .utenlandsAdresse shouldBe
                null

            soeknad.barn.find { it.foedselsnummer!!.svar.value == BARN_UGRADERT }!!.utenlandsAdresse shouldNotBe null
        }
    }
}