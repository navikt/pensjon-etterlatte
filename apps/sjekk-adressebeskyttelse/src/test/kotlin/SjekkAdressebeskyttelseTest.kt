package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.mockk.clearAllMocks
import io.mockk.coEvery
import io.mockk.mockk
import no.nav.etterlatte.libs.common.innsendtsoeknad.ArbeidOgUtdanningOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoedeOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoedeType
import no.nav.etterlatte.libs.common.innsendtsoeknad.InntektOgPensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.JobbStatusTypeOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.Kontaktinfo
import no.nav.etterlatte.libs.common.innsendtsoeknad.SivilstatusType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Spraak
import no.nav.etterlatte.libs.common.innsendtsoeknad.UtbetalingsInformasjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.YtelserAndre
import no.nav.etterlatte.libs.common.innsendtsoeknad.YtelserNav
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Avdoed
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.BetingetOpplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.DatoSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.EnumSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.FritekstSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.GjenlevendeOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Innsender
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.omstillingsstoenad.Omstillingsstoenad
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseResponse
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.*

internal class SjekkAdressebeskyttelseTest {

    private val klientMock = mockk<AdressebeskyttelseKlient>()
    private val service = AdressebeskyttelseService(klientMock)

    private val hendelseJson = lagHendelse()

    fun omstillingsSoeknad(): Omstillingsstoenad {
        return Omstillingsstoenad(
            imageTag = "9f1f95b2472742227b37d19dd2d735ac9001995e",
            spraak = Spraak.NB,
            innsender = Innsender(
                fornavn = Opplysning(
                    svar = "GØYAL",
                    spoersmaal = "Fornavn"
                ),
                etternavn = Opplysning(
                    svar = "HØYSTAKK",
                    spoersmaal = "Etternavn"
                ),
                foedselsnummer = Opplysning(
                    svar = Foedselsnummer.of("03108718357"),
                    spoersmaal = "Fødselsnummer"
                )
            ),
            harSamtykket = Opplysning(
                svar = true,
                spoersmaal = ""
            ),
            utbetalingsInformasjon = BetingetOpplysning(
                svar = EnumSvar(
                    verdi = BankkontoType.NORSK,
                    innhold = "Norsk"
                ),
                spoersmaal = "Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?",
                opplysning = UtbetalingsInformasjon(
                    kontonummer = Opplysning(
                        svar = FritekstSvar(
                            innhold = "6848.64.44444"
                        ),
                        spoersmaal = "Oppgi norsk kontonummer for utbetaling"
                    ),
                    utenlandskBankNavn = null,
                    utenlandskBankAdresse = null,
                    iban = null,
                    swift = null,
                    skattetrekk = null
                )
            ),
            soeker = GjenlevendeOMS(
                fornavn = Opplysning(svar = "Kirsten", spoersmaal = "Spoersmal"),
                etternavn = Opplysning(svar = "Jakobsen", spoersmaal = "Etternavn"),
                foedselsnummer = Opplysning(
                    svar = Foedselsnummer.of("26058411891"),
                    spoersmaal = "Barnets fødselsnummer / d-nummer"
                ),
                statsborgerskap = Opplysning(
                    svar = "Norge",
                    spoersmaal = "Statsborgerskap"
                ),
                sivilstatus = Opplysning(svar = "Gift", spoersmaal = "sivilstatus"),
                adresse = Opplysning(
                    svar = "Et sted 31",
                    spoersmaal = "adresse"
                ),
                bostedsAdresse = Opplysning(
                    svar = FritekstSvar(
                        innhold = "bostedadresse"
                    ),
                    spoersmaal = "bostedadresse"
                ),
                kontaktinfo = Kontaktinfo(
                    telefonnummer = Opplysning(
                        svar = FritekstSvar(
                            innhold = "12345678"
                        ),
                        spoersmaal = "telefonnummer"
                    )
                ),
                flyktning = null,
                oppholdUtland = BetingetOpplysning(
                    svar = EnumSvar(
                        verdi = JaNeiVetIkke.NEI,
                        innhold = "Nei"
                    ),
                    spoersmaal = null,
                    opplysning = null
                ),
                nySivilstatus = BetingetOpplysning(
                    svar = EnumSvar(
                        verdi = SivilstatusType.EKTESKAP,
                        innhold = "Nei"
                    ),
                    spoersmaal = null,
                    opplysning = null
                ),
                arbeidOgUtdanning = ArbeidOgUtdanningOMS(
                    dinSituasjon = Opplysning(
                        svar = listOf(
                            EnumSvar(
                            verdi = JobbStatusTypeOMS.ARBEIDSTAKER,
                            innhold = "Arbeidstaker"
                        )
                        ),
                        spoersmaal = null
                    ),
                    arbeidsforhold = null,
                    selvstendig = null,
                    etablererVirksomhet = null,
                    tilbud = null,
                    arbeidssoeker = null,
                    utdanning = null,
                    annenSituasjon = null
                ),
                fullfoertUtdanning = null,
                uregistrertEllerVenterBarn = Opplysning(
                    svar = EnumSvar(
                        verdi = JaNeiVetIkke.NEI,
                        innhold = "Nei"
                    ),
                    spoersmaal = null
                ),
                forholdTilAvdoede = ForholdTilAvdoedeOMS(
                    relasjon = Opplysning(
                        svar = EnumSvar(
                            verdi = ForholdTilAvdoedeType.GIFT,
                            innhold = "Nei"
                        ),
                        spoersmaal = null
                    ),
                    datoForInngaattPartnerskap = null,
                    datoForInngaattSamboerskap = null,
                    datoForSkilsmisse = null,
                    datoForSamlivsbrudd = null,
                    fellesBarn = null,
                    samboereMedFellesBarnFoerGiftemaal = null,
                    tidligereGift = null,
                    mottokBidrag = null
                ),
                inntektOgPensjon = InntektOgPensjon(
                    loennsinntekt = null,
                    naeringsinntekt = null,
                    pensjonEllerUfoere = null,
                    annenInntekt = null,
                    ytelserNAV = YtelserNav(
                        soektOmYtelse = Opplysning(
                            svar = EnumSvar(
                                verdi = JaNeiVetIkke.NEI,
                                innhold = "Nei"
                            )
                        ),
                        soektYtelse = null
                    ),
                    ytelserAndre = YtelserAndre(
                        soektOmYtelse = Opplysning(
                            svar = EnumSvar(
                                verdi = JaNeiVetIkke.NEI,
                                innhold = "Nei"
                            )
                        ),
                        soektYtelse = null,
                        pensjonsordning = null
                    )
                ),
                omsorgForBarn = Opplysning(
                    svar = EnumSvar(
                        verdi = JaNeiVetIkke.NEI,
                        innhold = "Nei"
                    )
                )
            ),
            avdoed = Avdoed(
                fornavn = Opplysning(svar = "Bernt", spoersmaal = null),
                etternavn = Opplysning(svar = "Jakobsen", spoersmaal = null),
                foedselsnummer = Opplysning(
                    svar = Foedselsnummer.of("22128202440"),
                    spoersmaal = "Barnets fødselsnummer / d-nummer"
                ),
                datoForDoedsfallet = Opplysning(
                    svar = DatoSvar(
                        innhold = LocalDate.parse("2022-01-01")
                    ),
                    spoersmaal = null
                ),
                statsborgerskap = Opplysning(
                    svar = FritekstSvar(
                        innhold = "Norge"
                    ),
                    spoersmaal = null
                ),
                utenlandsopphold = BetingetOpplysning(
                    svar = EnumSvar(
                        verdi = JaNeiVetIkke.NEI,
                        innhold = ""
                    ),
                    spoersmaal = null,
                    opplysning = null
                ),
                doedsaarsakSkyldesYrkesskadeEllerYrkessykdom = Opplysning(
                    svar = EnumSvar(
                        verdi = JaNeiVetIkke.NEI,
                        innhold = ""
                    ),
                    spoersmaal = null
                ),
                naeringsInntekt = null,
                militaertjeneste = null
            ),
            barn = listOf()

        )
    }

    fun lagHendelse(): String {
        val message = mapOf(
            "@lagret_soeknad_id" to "404",
            "@fnr_soeker" to "07106123912",
            "@event_name" to "soeknad_innsendt",
            "@skjema_info" to omstillingsSoeknad()
        ).toJson()
        return message
    }

    @AfterEach
    fun afterEach() {
        clearAllMocks()
    }

    @Test
    fun testFeltMapping() {
        coEvery { klientMock.finnAdressebeskyttelseForFnr(any(), any()) } returns opprettRespons(
            Gradering.FORTROLIG,
            Gradering.STRENGT_FORTROLIG
        )

        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, service) }
            .apply { sendTestMessage(hendelseJson) }
            .inspektør

        assertEquals(
            Gradering.STRENGT_FORTROLIG.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun testTomResponse() {
        coEvery { klientMock.finnAdressebeskyttelseForFnr(any(), any()) } returns opprettRespons()

        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, service) }
            .apply { sendTestMessage(hendelseJson) }
            .inspektør

        assertEquals(
            Gradering.UGRADERT.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun testenTomOgEnVanlig() {
        coEvery { klientMock.finnAdressebeskyttelseForFnr(any(), any()) } returns opprettRespons(
            Gradering.UGRADERT,
            Gradering.STRENGT_FORTROLIG_UTLAND
        )

        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, service) }
            .apply { sendTestMessage(hendelseJson) }
            .inspektør

        assertEquals(
            Gradering.STRENGT_FORTROLIG_UTLAND.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun `Skal finne alle gyldige fødselsnummer i søknaden`() {
        val resultat: List<Foedselsnummer> = jacksonObjectMapper().readTree(hendelseJson).finnFoedselsnummer()
        assertEquals(4, resultat.size)
    }

    private fun opprettRespons(vararg gradering: Gradering): AdressebeskyttelseResponse {
        val graderingString = gradering.joinToString { "{\"gradering\" : \"$it\"}" }

        val json = """
            {
              "data": {
                "hentPersonBolk": [
                  {
                    "ident": "12345678910",
                    "person": { "adressebeskyttelse": [$graderingString] }
                  }
                ]
              }
            }
        """

        return jacksonObjectMapper().readValue(json, jacksonTypeRef())
    }
}
