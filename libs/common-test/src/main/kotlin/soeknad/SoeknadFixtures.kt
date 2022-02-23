package soeknad

import no.nav.etterlatte.libs.common.innsendtsoeknad.AndreYtelser
import no.nav.etterlatte.libs.common.innsendtsoeknad.ArbeidOgUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.Arbeidstaker
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoede
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoedeType
import no.nav.etterlatte.libs.common.innsendtsoeknad.HoeyesteUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.IngenJobb
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
import no.nav.etterlatte.libs.common.innsendtsoeknad.Spraak
import no.nav.etterlatte.libs.common.innsendtsoeknad.StillingType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Stoenader
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
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.DatoSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.EnumSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Forelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.FritekstSvar
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
        spraak = Spraak.NB,
        innsender = Innsender(
            fornavn = Opplysning("Ola"),
            etternavn = Opplysning("Nordmann"),
            foedselsnummer = Opplysning(innsenderFnr)
        ),
        harSamtykket = Opplysning(svar = true),
        utbetalingsInformasjon = BetingetOpplysning(
            svar = EnumSvar(BankkontoType.NORSK, "Norsk"),
            opplysning = UtbetalingsInformasjon(
                kontonummer = Opplysning(FritekstSvar("12010501012"))
            )
        ),
        soeker = eksempelBarn(soekerFnr),
        foreldre = listOf(
            GjenlevendeForelder(
                fornavn = Opplysning("Stor"),
                etternavn = Opplysning("Snerk"),
                foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
                adresse = Opplysning("Hjemmeveien 21"),
                statsborgerskap = Opplysning("Norsk"),
                kontaktinfo = Kontaktinfo(
                    telefonnummer = Opplysning(FritekstSvar("12345678"))
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
        spraak = Spraak.NB,
        innsender = Innsender(
            fornavn = Opplysning("Ola"),
            etternavn = Opplysning("Nordmann"),
            foedselsnummer = Opplysning(innsenderFnr),
        ),
        harSamtykket = Opplysning(svar = true),
        utbetalingsInformasjon = BetingetOpplysning(
            svar = EnumSvar(BankkontoType.NORSK, "Norsk"),
            opplysning = UtbetalingsInformasjon(
                kontonummer = Opplysning(FritekstSvar("12010501012"))
            )
        ),
        soeker = Gjenlevende(
            fornavn = Opplysning("Ola"),
            etternavn = Opplysning("Nordmann"),
            foedselsnummer = Opplysning(soekerFnr),
            statsborgerskap = Opplysning("Norsk"),
            sivilstatus = Opplysning("Ugift"),
            adresse = Opplysning("Fyrstikkalleen 1"),
            bostedsAdresse = BetingetOpplysning(
                svar = EnumSvar(NEI, "Nei"),
                opplysning = Opplysning(FritekstSvar("Kirkeveien 1")),
            ),
            kontaktinfo = Kontaktinfo(
                telefonnummer = Opplysning(FritekstSvar("97611679"))
            ),
            flyktning = Opplysning(EnumSvar(NEI, "Nei")),
            oppholdUtland = BetingetOpplysning(
                svar = EnumSvar(NEI, "Nei"),
                opplysning = OppholdUtland(
                    land = Opplysning(FritekstSvar("Sverige")),
                    medlemFolketrygd = Opplysning(EnumSvar(JA, "Ja"))
                )
            ),
            nySivilstatus = BetingetOpplysning(
                svar = EnumSvar(SivilstatusType.SAMBOERSKAP, "Samboer"),
                opplysning = Samboer(
                    fornavn = Opplysning("Hans"),
                    etternavn = Opplysning("Pettersen"),
                    foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
                    fellesBarnEllertidligereGift = Opplysning(EnumSvar(JA, "Ja")),
                    inntekt = BetingetOpplysning(
                        svar = EnumSvar(JA, "Ja"),
                        opplysning = SamboerInntekt(
                            inntektstype = Opplysning(listOf(EnumSvar(InntektType.ANDRE_YTELSER, "Andre ytelser"))),
                            samletBruttoinntektPrAar = Opplysning(FritekstSvar("kr 200 000,-"))
                        )
                    )
                )
            ),
            arbeidOgUtdanning = ArbeidOgUtdanning(
                dinSituasjon = Opplysning(
                    listOf(
                        EnumSvar(JobbStatusType.ARBEIDSTAKER, "Arbeidstaker"),
                        EnumSvar(JobbStatusType.INGEN, "Ingen"),
                        EnumSvar(JobbStatusType.SELVSTENDIG, "Selvstendig"),
                        EnumSvar(JobbStatusType.UNDER_UTDANNING, "Under utdanning")
                    )
                ),
                arbeidsforhold = Opplysning(
                    listOf(
                        Arbeidstaker(
                            arbeidsgiver = Opplysning(FritekstSvar("Byggevarekjeden")),
                            ansettelsesforhold = Opplysning(EnumSvar(StillingType.FAST, "Fast ansettelse")),
                            stillingsprosent = Opplysning(FritekstSvar("100")),
                            endretInntekt = BetingetOpplysning(
                                svar = EnumSvar(JA, "Ja"),
                                opplysning = Opplysning(FritekstSvar("Mye har skjedd i det siste"))
                            )
                        )
                    )
                ),
                selvstendig = Opplysning(
                    listOf(
                        SelvstendigNaeringsdrivende(
                            firmanavn = Opplysning(FritekstSvar("Mitt firma!")),
                            orgnr = Opplysning(FritekstSvar("12313123")),
                            endretInntekt = BetingetOpplysning(
                                svar = EnumSvar(JA, "Ja"),
                                opplysning = Opplysning(FritekstSvar("Fremdeles mye som har skjedd.."))
                            )
                        )
                    )
                ),
                utdanning = Opplysning(
                    Utdanning(
                        navn = Opplysning(FritekstSvar("Norges IT høyskole")),
                        startDato = Opplysning(DatoSvar(LocalDate.now().minusYears(1))),
                        sluttDato = Opplysning(DatoSvar(LocalDate.now().plusYears(2)))
                    )
                ),
                annet = Opplysning(EnumSvar(innhold = "Annet", verdi = IngenJobb.ANNET))
            ),
            fullfoertUtdanning = BetingetOpplysning(
                svar = EnumSvar(HoeyesteUtdanning.ANNEN, "Annen"),
                opplysning = Opplysning(FritekstSvar("Livets harde skole"))
            ),
            andreYtelser = AndreYtelser(
                kravOmAnnenStonad = BetingetOpplysning(
                    svar = EnumSvar(JA, "Ja"),
                    opplysning = Opplysning(EnumSvar(Ytelser.FORELDREPENGER, "Foreldrepenger"))
                ),
                annenPensjon = BetingetOpplysning(
                    svar = EnumSvar(JA, "Ja"),
                    opplysning = Opplysning(FritekstSvar("KLP"))
                ),
                pensjonUtland = BetingetOpplysning(
                    svar = EnumSvar(JA, "Ja"),
                    opplysning = PensjonUtland(
                        pensjonsType = Opplysning(FritekstSvar("Uføre")),
                        land = Opplysning(FritekstSvar("Sverige")),
                        bruttobeloepPrAar = Opplysning(FritekstSvar("20000 SEK"))

                    )
                )
            ),
            uregistrertEllerVenterBarn = Opplysning(EnumSvar(NEI, "Nei")),
            forholdTilAvdoede = ForholdTilAvdoede(
                relasjon = Opplysning(EnumSvar(ForholdTilAvdoedeType.GIFT, "Gift")),
                datoForInngaattPartnerskap = Opplysning(DatoSvar(LocalDate.now().minusYears(20))),
                fellesBarn = Opplysning(EnumSvar(JA, "Ja")),
                omsorgForBarn = Opplysning(EnumSvar(NEI, "Nei"))
            )
        ),
        avdoed = eksempelAvdoed(),
        barn = listOf(
            eksempelBarn(Foedselsnummer.of("24014021406"), OmsorgspersonType.GJENLEVENDE),
            eksempelBarn(Foedselsnummer.of("29080775995"), OmsorgspersonType.ANNET)
        ),
        andreStoenader = listOf(Opplysning(
            svar = EnumSvar(Stoenader.BARNETILSYN, "Jeg har utgifter til barnetilstyn0"),
            spoersmaal = "Søknad om barnetilsyn"
        ))
    )
}

fun eksempelBarn(fnr: Foedselsnummer, dagligOmsorg: OmsorgspersonType? = null) = Barn(
    fornavn = Opplysning("Ole"),
    etternavn = Opplysning("Hansen"),
    foedselsnummer = Opplysning(fnr),
    statsborgerskap = Opplysning("Norge"),
    utenlandsAdresse = BetingetOpplysning(
        svar = EnumSvar(JA, "Ja"),
        opplysning = Utenlandsadresse(
            land = Opplysning(FritekstSvar("Sverige")),
            adresse = Opplysning(FritekstSvar("Kirkeveien 345A"))
        )
    ),
    dagligOmsorg = if (dagligOmsorg != null) Opplysning(
        spoersmaal = "Har du daglig omsorg for dette barnet?",
        svar = EnumSvar(dagligOmsorg, dagligOmsorg.name.lowercase())
    ) else null,
    foreldre = listOf(
        Forelder(
            fornavn = Opplysning("Mor senior"),
            etternavn = Opplysning("Nordmann"),
            foedselsnummer = Opplysning(Foedselsnummer.of("24014021406"))
        ),
        Forelder(
            fornavn = Opplysning("Far senior"),
            etternavn = Opplysning("Nordmann"),
            foedselsnummer = Opplysning(Foedselsnummer.of("24014021406"))
        )
    ),
    verge = BetingetOpplysning(
        svar = EnumSvar(JA, "Ja"),
        opplysning = Verge(
            fornavn = Opplysning("Verge"),
            etternavn = Opplysning("Vergeson"),
            foedselsnummer = Opplysning(Foedselsnummer.of("24014021406"))
        )
    ),
)

fun eksempelAvdoed() = Avdoed(
    fornavn = Opplysning("Petter"),
    etternavn = Opplysning("Hansen"),
    foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
    datoForDoedsfallet = Opplysning(DatoSvar(LocalDate.now())),
    statsborgerskap = Opplysning(FritekstSvar("Norsk")),
    utenlandsopphold = BetingetOpplysning(
        svar = EnumSvar(JA, "Ja"),
        opplysning = listOf(
            Utenlandsopphold(
                land = Opplysning(FritekstSvar("Danmark")),
                fraDato = Opplysning(DatoSvar(LocalDate.now().minusYears(10))),
                tilDato = Opplysning(DatoSvar(LocalDate.now().minusYears(5))),
                oppholdsType = Opplysning(
                    listOf(
                        EnumSvar(OppholdUtlandType.ARBEIDET, "Arbeidet"),
                        EnumSvar(OppholdUtlandType.BODD, "Bodd")
                    )
                ),
                medlemFolketrygd = Opplysning(EnumSvar(JA, "Ja")),
                pensjonsutbetaling = Opplysning(FritekstSvar("150000"))
            )
        )
    ),
    naeringsInntekt = BetingetOpplysning(
        svar = EnumSvar(JA, "Ja"),
        opplysning = Naeringsinntekt(
            naeringsinntektPrAarFoerDoedsfall = Opplysning(FritekstSvar("20000")),
            naeringsinntektVedDoedsfall = Opplysning(EnumSvar(JA, "Ja"))

        )
    ),
    militaertjeneste = BetingetOpplysning(
        svar = EnumSvar(JA, "Ja"),
        opplysning = Opplysning(FritekstSvar("2015, 2016"))
    ),
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom = Opplysning(EnumSvar(JA, "Ja"))
)
