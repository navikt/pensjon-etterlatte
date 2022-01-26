package soeknad

import no.nav.etterlatte.libs.common.innsendtsoeknad.AndreYtelser
import no.nav.etterlatte.libs.common.innsendtsoeknad.ArbeidOgUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.Arbeidstaker
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoede
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoedeType
import no.nav.etterlatte.libs.common.innsendtsoeknad.HoeyesteUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.InntektType
import no.nav.etterlatte.libs.common.innsendtsoeknad.JobbStatusType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Kontaktinfo
import no.nav.etterlatte.libs.common.innsendtsoeknad.Naeringsinntekt
import no.nav.etterlatte.libs.common.innsendtsoeknad.OmsorgspersonType
import no.nav.etterlatte.libs.common.innsendtsoeknad.OppholdUtland
import no.nav.etterlatte.libs.common.innsendtsoeknad.OppholdUtlandType
import no.nav.etterlatte.libs.common.innsendtsoeknad.PensjonUtland
import no.nav.etterlatte.libs.common.innsendtsoeknad.SamboerInntekt
import no.nav.etterlatte.libs.common.innsendtsoeknad.SelvstendigNaeringsdrivende
import no.nav.etterlatte.libs.common.innsendtsoeknad.SivilstatusType
import no.nav.etterlatte.libs.common.innsendtsoeknad.StillingType
import no.nav.etterlatte.libs.common.innsendtsoeknad.UtbetalingsInformasjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsadresse
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsopphold
import no.nav.etterlatte.libs.common.innsendtsoeknad.Ytelser
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.GjenlevendeForelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Avdoed
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.BetingetOpplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Forelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Innsender
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Samboer
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke.JA
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke.NEI
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Verge
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevende
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevendepensjon
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.time.LocalDate
import java.util.*

object InnsendtSoeknadFixtures {
    /**
     * @param innsenderFnr: Personen som har sendt inn søknaden (gjerne på vegne av barnet).
     * @param soekerFnr: Barnet som søker om barnepensjon.
     */
    fun barnepensjon(
        innsenderFnr: Foedselsnummer = Foedselsnummer.of("11057523044"), // STOR SNERK
        soekerFnr: Foedselsnummer = Foedselsnummer.of("05111850870"), // BLÅØYD SAKS
    ) = Barnepensjon(
        imageTag = UUID.randomUUID().toString(),
        innsender = Innsender(
            fornavn = "Ola",
            etternavn = "Nordmann",
            foedselsnummer = innsenderFnr
        ),
        harSamtykket = Opplysning(svar = true),
        utbetalingsInformasjon = BetingetOpplysning(
            svar = BankkontoType.NORSK,
            opplysning = UtbetalingsInformasjon(
                kontonummer = Opplysning("12010501012")
            )
        ),
        soeker = eksempelBarn(soekerFnr),
        foreldre = listOf(
            GjenlevendeForelder(
                fornavn = "Stor",
                etternavn = "Snerk",
                foedselsnummer = Foedselsnummer.of("24014021406"),
                adresse = Opplysning("Hjemmeveien 21"),
                statsborgerskap = Opplysning("Norsk"),
                kontaktinfo = Kontaktinfo(
                    epost = Opplysning("Stor.Snerk@Norge.no"),
                    telefonnummer = Opplysning("12345678")
                )
            ),
            eksempelAvdoed()
        ),
        soesken = listOf(eksempelBarn(Foedselsnummer.of("29080775995")))
    )

    /**
     * @param innsenderFnr: Personen som har sendt inn søknaden (stort sett den gjenlevende).
     * @param soekerFnr: Personen som søker om stønaden. Som oftest samme verdi som innsender.
     */
    fun gjenlevendepensjon(
        innsenderFnr: Foedselsnummer = Foedselsnummer.of("11057523044"), // STOR SNERK
        soekerFnr: Foedselsnummer = innsenderFnr
    ) = Gjenlevendepensjon(
        imageTag = UUID.randomUUID().toString(),
        innsender = Innsender(
            fornavn = "Ola",
            etternavn = "Nordmann",
            foedselsnummer = innsenderFnr,
        ),
        harSamtykket = Opplysning(svar = true),
        utbetalingsInformasjon = BetingetOpplysning(
            svar = BankkontoType.NORSK,
            opplysning = UtbetalingsInformasjon(
                kontonummer = Opplysning("12010501012")
            )
        ),
        soeker = Gjenlevende(
            fornavn = "Ola",
            etternavn = "Nordmann",
            foedselsnummer = soekerFnr,
            statsborgerskap = "Norsk",
            sivilstatus = "Ugift",
            adresse = Opplysning("Fyrstikkalleen 1"),
            bostedsAdresse = BetingetOpplysning(
                svar = NEI,
                opplysning = Opplysning("Kirkeveien 1"),
            ),
            kontaktinfo = Kontaktinfo(
                epost = Opplysning("ola.nordmann@norge.no"),
                telefonnummer = Opplysning("97611679")
            ),
            flyktning = Opplysning(NEI),
            oppholdUtland = BetingetOpplysning(
                svar = NEI,
                opplysning = OppholdUtland(
                    land = Opplysning("Sverige"),
                    medlemFolketrygd = Opplysning(JA)
                )
            ),
            nySivilstatus = BetingetOpplysning(
                svar = SivilstatusType.SAMBOERSKAP,
                opplysning = Samboer(
                    fornavn = "Hans",
                    etternavn = "Pettersen",
                    foedselsnummer = Foedselsnummer.of("24014021406"),
                    fellesBarnEllertidligereGift = Opplysning(JA),
                    inntekt = BetingetOpplysning(
                        svar = JA,
                        opplysning = SamboerInntekt(
                            inntektstype = Opplysning(listOf(InntektType.ANDRE_YTELSER)),
                            samletBruttoinntektPrAar = Opplysning("200000")
                        )
                    )
                )
            ),
            arbeidOgUtdanning = ArbeidOgUtdanning(
                dinSituasjon = Opplysning(
                    listOf(
                        JobbStatusType.ARBEIDSTAKER,
                        JobbStatusType.INGEN,
                        JobbStatusType.SELVSTENDIG,
                        JobbStatusType.UNDER_UTDANNING
                    )
                ),
                arbeidsforhold = Opplysning(
                    listOf(
                        Arbeidstaker(
                            arbeidsgiver = Opplysning("Byggevarekjeden"),
                            ansettelsesforhold = Opplysning(StillingType.FAST),
                            stillingsprosent = Opplysning("100"),
                            endretInntekt = BetingetOpplysning(
                                svar = JA,
                                opplysning = Opplysning("Mye har skjedd i det siste")
                            )
                        )
                    )
                ),
                selvstendig = Opplysning(
                    listOf(
                        SelvstendigNaeringsdrivende(
                            firmanavn = Opplysning("Mitt firma!"),
                            orgnr = Opplysning("12313123"),
                            endretInntekt = BetingetOpplysning(
                                svar = JA,
                                opplysning = Opplysning("Fremdeles mye som har skjedd..")
                            )
                        )
                    )
                ),
                utdanning = Opplysning(
                    Utdanning(
                        navn = Opplysning("Norges IT høyskole"),
                        startDato = Opplysning(LocalDate.now().minusYears(1)),
                        sluttDato = Opplysning(LocalDate.now().plusYears(2))
                    )
                ),
                annet = Opplysning("Driver med mye på fritiden")
            ),
            fullfoertUtdanning = BetingetOpplysning(
                svar = HoeyesteUtdanning.ANNEN,
                opplysning = Opplysning("Livets harde skole")
            ),
            andreYtelser = AndreYtelser(
                kravOmAnnenStonad = BetingetOpplysning(
                    svar = JA,
                    opplysning = Opplysning(Ytelser.FORELDREPENGER)
                ),
                annenPensjon = BetingetOpplysning(
                    svar = JA,
                    opplysning = Opplysning("KLP")
                ),
                pensjonUtland = BetingetOpplysning(
                    svar = JA,
                    opplysning = PensjonUtland(
                        pensjonsType = Opplysning("Uføre"),
                        land = Opplysning("Sverige"),
                        bruttobeloepPrAar = Opplysning("20000 SEK")

                    )
                )
            ),
            uregistrertEllerVenterBarn = Opplysning(NEI),
            forholdTilAvdoede = ForholdTilAvdoede(
                relasjon = Opplysning(ForholdTilAvdoedeType.GIFT),
                datoForInngaattPartnerskap = Opplysning(LocalDate.now().minusYears(20)),
                fellesBarn = Opplysning(JA),
                omsorgForBarn = Opplysning(NEI)
            )
        ),
        avdoed = eksempelAvdoed(),
        barn = listOf(
            eksempelBarn(Foedselsnummer.of("24014021406"), OmsorgspersonType.GJENLEVENDE),
            eksempelBarn(Foedselsnummer.of("29080775995"), OmsorgspersonType.ANNET)
        )
    )
}

fun eksempelBarn(fnr: Foedselsnummer, dagligOmsorg: OmsorgspersonType? = null) = Barn(
    fornavn = "Ole",
    etternavn = "Hansen",
    foedselsnummer = fnr,
    statsborgerskap = Opplysning("Norge"),
    utenlandsAdresse = BetingetOpplysning(
        svar = JA,
        opplysning = Utenlandsadresse(
            land = Opplysning("Sverige"),
            adresse = Opplysning("Kirkeveien 345A")
        )
    ),
    dagligOmsorg = if (dagligOmsorg != null) Opplysning(
        spoersmaal = "Har du daglig omsorg for dette barnet?",
        svar = dagligOmsorg
    ) else null,
    foreldre = listOf(
        Forelder(
            fornavn = "Mor senior",
            etternavn = "Nordmann",
            foedselsnummer = Foedselsnummer.of("24014021406")
        ),
        Forelder(
            fornavn = "Far senior",
            etternavn = "Nordmann",
            foedselsnummer = Foedselsnummer.of("24014021406")
        )
    ),
    verge = BetingetOpplysning(
        svar = JA,
        opplysning = Verge(
            fornavn = "Verge",
            etternavn = "Vergeson",
            foedselsnummer = Foedselsnummer.of("24014021406")
        )
    ),
)

fun eksempelAvdoed() = Avdoed(
    fornavn = "Petter",
    etternavn = "Hansen",
    foedselsnummer = Foedselsnummer.of("24014021406"),
    datoForDoedsfallet = Opplysning(LocalDate.now()),
    statsborgerskap = Opplysning("Norsk"),
    utenlandsopphold = BetingetOpplysning(
        svar = JA,
        opplysning = listOf(
            Utenlandsopphold(
                land = Opplysning("Danmark"),
                fraDato = Opplysning(LocalDate.now().minusYears(10)),
                tilDato = Opplysning(LocalDate.now().minusYears(5)),
                oppholdsType = Opplysning(listOf(OppholdUtlandType.ARBEIDET, OppholdUtlandType.BODD)),
                medlemFolketrygd = Opplysning(JA),
                pensjonsutbetaling = Opplysning("150000")
            )
        )
    ),
    naeringsInntekt = BetingetOpplysning(
        svar = JA,
        opplysning = Naeringsinntekt(
            naeringsinntektPrAarFoerDoedsfall = Opplysning("20000"),
            naeringsinntektVedDoedsfall = Opplysning(JA)

        )
    ),
    militaertjeneste = BetingetOpplysning(
        svar = JA,
        opplysning = Opplysning("2015, 2016")
    ),
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom = Opplysning(JA)
)
