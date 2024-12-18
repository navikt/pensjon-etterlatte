package no.nav.etterlatte.libs.utils.test

import no.nav.etterlatte.libs.common.innsendtsoeknad.ArbeidOgUtdanningOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoedeOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoedeType
import no.nav.etterlatte.libs.common.innsendtsoeknad.InntektOgPensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.JobbStatusTypeOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.Kontaktinfo
import no.nav.etterlatte.libs.common.innsendtsoeknad.OmsorgspersonType
import no.nav.etterlatte.libs.common.innsendtsoeknad.OppholdUtlandType
import no.nav.etterlatte.libs.common.innsendtsoeknad.SivilstatusType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Spraak
import no.nav.etterlatte.libs.common.innsendtsoeknad.UtbetalingsInformasjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsadresse
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsopphold
import no.nav.etterlatte.libs.common.innsendtsoeknad.YtelserAndre
import no.nav.etterlatte.libs.common.innsendtsoeknad.YtelserNav
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.GjenlevendeForelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Avdoed
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.BetingetOpplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.DatoSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.EnumSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Forelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.FritekstSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.GjenlevendeOMS
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Innsender
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke.JA
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke.NEI
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Verge
import no.nav.etterlatte.libs.common.innsendtsoeknad.omstillingsstoenad.Omstillingsstoenad
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.time.LocalDate
import java.util.UUID

object InnsendtSoeknadFixtures {
    /**
     * @param innsenderFnr: Personen som har sendt inn søknaden (gjerne på vegne av barnet).
     * @param soekerFnr: Barnet som søker om barnepensjon.
     */
    fun barnepensjon(
        // STOR SNERK
        innsenderFnr: Foedselsnummer = Foedselsnummer.of("11057523044"),
        // BLÅØYD SAKS
        soekerFnr: Foedselsnummer = Foedselsnummer.of("05111850870"),
        avdoed: Foedselsnummer? = null,
        soesken: List<Foedselsnummer> = listOf(Foedselsnummer.of("29080775995")),
    ) = Barnepensjon(
        imageTag = UUID.randomUUID().toString(),
        spraak = Spraak.NB,
        innsender =
            Innsender(
                fornavn = Opplysning("Ola"),
                etternavn = Opplysning("Nordmann"),
                foedselsnummer = Opplysning(innsenderFnr),
            ),
        harSamtykket = Opplysning(svar = true),
        utbetalingsInformasjon =
            BetingetOpplysning(
                svar = EnumSvar(BankkontoType.NORSK, "Norsk"),
                opplysning =
                    UtbetalingsInformasjon(
                        kontonummer = Opplysning(FritekstSvar("12010501012")),
                    ),
            ),
        soeker = eksempelBarn(soekerFnr),
        foreldre =
            listOf(
                GjenlevendeForelder(
                    fornavn = Opplysning("Stor"),
                    etternavn = Opplysning("Snerk"),
                    foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
                    adresse = Opplysning("Hjemmeveien 21"),
                    statsborgerskap = Opplysning("Norsk"),
                    kontaktinfo =
                        Kontaktinfo(
                            telefonnummer = Opplysning(FritekstSvar("12345678")),
                        ),
                ),
                avdoedMedUtenlandsopphold(avdoed),
            ),
        soesken = soesken.map { eksempelBarn(it) },
    )

    fun omstillingsSoeknad(
        innsenderFnr: Foedselsnummer = Foedselsnummer.of("11057523044"), // STOR SNERK
        soekerFnr: Foedselsnummer = innsenderFnr,
        avdoed: Foedselsnummer? = null,
        barn: List<Barn> = emptyList(),
    ): Omstillingsstoenad =
        Omstillingsstoenad(
            imageTag = "9f1f95b2472742227b37d19dd2d735ac9001995e",
            spraak = Spraak.NB,
            innsender =
                Innsender(
                    fornavn =
                        Opplysning(
                            svar = "GØYAL",
                            spoersmaal = "Fornavn",
                        ),
                    etternavn =
                        Opplysning(
                            svar = "HØYSTAKK",
                            spoersmaal = "Etternavn",
                        ),
                    foedselsnummer =
                        Opplysning(
                            svar = innsenderFnr,
                            spoersmaal = "Fødselsnummer",
                        ),
                ),
            harSamtykket =
                Opplysning(
                    svar = true,
                    spoersmaal = "",
                ),
            utbetalingsInformasjon =
                BetingetOpplysning(
                    svar =
                        EnumSvar(
                            verdi = BankkontoType.NORSK,
                            innhold = "Norsk",
                        ),
                    spoersmaal = "Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?",
                    opplysning =
                        UtbetalingsInformasjon(
                            kontonummer =
                                Opplysning(
                                    svar =
                                        FritekstSvar(
                                            innhold = "6848.64.44444",
                                        ),
                                    spoersmaal = "Oppgi norsk kontonummer for utbetaling",
                                ),
                            utenlandskBankNavn = null,
                            utenlandskBankAdresse = null,
                            iban = null,
                            swift = null,
                        ),
                ),
            soeker =
                GjenlevendeOMS(
                    fornavn = Opplysning(svar = "Kirsten", spoersmaal = "Spoersmal"),
                    etternavn = Opplysning(svar = "Jakobsen", spoersmaal = "Etternavn"),
                    foedselsnummer =
                        Opplysning(
                            svar = soekerFnr,
                            spoersmaal = "Fødselsnummer / d-nummer",
                        ),
                    statsborgerskap =
                        Opplysning(
                            svar = "Norge",
                            spoersmaal = "Statsborgerskap",
                        ),
                    sivilstatus = Opplysning(svar = "Gift", spoersmaal = "sivilstatus"),
                    adresse =
                        Opplysning(
                            svar = "Et sted 31",
                            spoersmaal = "adresse",
                        ),
                    bostedsAdresse =
                        Opplysning(
                            svar =
                                FritekstSvar(
                                    innhold = "bostedadresse",
                                ),
                            spoersmaal = "bostedadresse",
                        ),
                    kontaktinfo =
                        Kontaktinfo(
                            telefonnummer =
                                Opplysning(
                                    svar =
                                        FritekstSvar(
                                            innhold = "12345678",
                                        ),
                                    spoersmaal = "telefonnummer",
                                ),
                        ),
                    flyktning = null,
                    oppholdUtland =
                        BetingetOpplysning(
                            svar =
                                EnumSvar(
                                    verdi = NEI,
                                    innhold = "Nei",
                                ),
                            spoersmaal = null,
                            opplysning = null,
                        ),
                    nySivilstatus =
                        BetingetOpplysning(
                            svar =
                                EnumSvar(
                                    verdi = SivilstatusType.EKTESKAP,
                                    innhold = "Nei",
                                ),
                            spoersmaal = null,
                            opplysning = null,
                        ),
                    arbeidOgUtdanning =
                        ArbeidOgUtdanningOMS(
                            dinSituasjon =
                                Opplysning(
                                    svar =
                                        listOf(
                                            EnumSvar(
                                                verdi = JobbStatusTypeOMS.ARBEIDSTAKER,
                                                innhold = "Arbeidstaker",
                                            ),
                                        ),
                                    spoersmaal = null,
                                ),
                            arbeidsforhold = null,
                            selvstendig = null,
                            etablererVirksomhet = null,
                            tilbud = null,
                            arbeidssoeker = null,
                            utdanning = null,
                            annenSituasjon = null,
                        ),
                    fullfoertUtdanning = null,
                    uregistrertEllerVenterBarn =
                        Opplysning(
                            svar =
                                EnumSvar(
                                    verdi = NEI,
                                    innhold = "Nei",
                                ),
                            spoersmaal = null,
                        ),
                    forholdTilAvdoede =
                        ForholdTilAvdoedeOMS(
                            relasjon =
                                Opplysning(
                                    svar =
                                        EnumSvar(
                                            verdi = ForholdTilAvdoedeType.GIFT,
                                            innhold = "Nei",
                                        ),
                                    spoersmaal = null,
                                ),
                            datoForInngaattPartnerskap = null,
                            datoForInngaattSamboerskap = null,
                            datoForSkilsmisse = null,
                            datoForSamlivsbrudd = null,
                            fellesBarn = null,
                            samboereMedFellesBarnFoerGiftemaal = null,
                            tidligereGift = null,
                            mottokBidrag = null,
                        ),
                    inntektOgPensjon =
                        InntektOgPensjon(
                            loennsinntekt = null,
                            naeringsinntekt = null,
                            pensjonEllerUfoere = null,
                            inntektViaYtelserFraNAV = null,
                            ingenInntekt = null,
                            ytelserNAV =
                                YtelserNav(
                                    soektOmYtelse =
                                        Opplysning(
                                            svar =
                                                EnumSvar(
                                                    verdi = NEI,
                                                    innhold = "Nei",
                                                ),
                                        ),
                                    soektYtelse = null,
                                ),
                            ytelserAndre =
                                YtelserAndre(
                                    soektOmYtelse =
                                        Opplysning(
                                            svar =
                                                EnumSvar(
                                                    verdi = NEI,
                                                    innhold = "Nei",
                                                ),
                                        ),
                                    soektYtelse = null,
                                    pensjonsordning = null,
                                ),
                        ),
                    omsorgForBarn =
                        Opplysning(
                            svar =
                                EnumSvar(
                                    verdi = NEI,
                                    innhold = "Nei",
                                ),
                        ),
                ),
            avdoed =
                Avdoed(
                    fornavn = Opplysning(svar = "Bernt", spoersmaal = null),
                    etternavn = Opplysning(svar = "Jakobsen", spoersmaal = null),
                    foedselsnummer =
                        Opplysning(
                            svar = avdoed ?: Foedselsnummer.of("22128202440"),
                            spoersmaal = "Barnets fødselsnummer / d-nummer",
                        ),
                    datoForDoedsfallet =
                        Opplysning(
                            svar =
                                DatoSvar(
                                    innhold = LocalDate.parse("2022-01-01"),
                                ),
                            spoersmaal = null,
                        ),
                    statsborgerskap =
                        Opplysning(
                            svar =
                                FritekstSvar(
                                    innhold = "Norge",
                                ),
                            spoersmaal = null,
                        ),
                    utenlandsopphold =
                        BetingetOpplysning(
                            svar =
                                EnumSvar(
                                    verdi = NEI,
                                    innhold = "",
                                ),
                            spoersmaal = null,
                            opplysning = null,
                        ),
                    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom =
                        Opplysning(
                            svar =
                                EnumSvar(
                                    verdi = NEI,
                                    innhold = "",
                                ),
                            spoersmaal = null,
                        ),
                    militaertjeneste = null,
                ),
            barn = barn,
        )
}

fun eksempelBarn(
    fnr: Foedselsnummer,
    dagligOmsorg: OmsorgspersonType? = null,
) = Barn(
    fornavn = Opplysning("Ole"),
    etternavn = Opplysning("Hansen"),
    foedselsnummer = Opplysning(fnr),
    statsborgerskap = Opplysning("Norge"),
    utenlandsAdresse =
        BetingetOpplysning(
            svar = EnumSvar(JA, "Ja"),
            opplysning =
                Utenlandsadresse(
                    land = Opplysning(FritekstSvar("Sverige")),
                    adresse = Opplysning(FritekstSvar("Kirkeveien 345A")),
                ),
        ),
    dagligOmsorg =
        if (dagligOmsorg != null) {
            Opplysning(
                spoersmaal = "Har du daglig omsorg for dette barnet?",
                svar = EnumSvar(dagligOmsorg, dagligOmsorg.name.lowercase()),
            )
        } else {
            null
        },
    foreldre =
        listOf(
            Forelder(
                fornavn = Opplysning("Mor senior"),
                etternavn = Opplysning("Nordmann"),
                foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
            ),
            Forelder(
                fornavn = Opplysning("Far senior"),
                etternavn = Opplysning("Nordmann"),
                foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
            ),
        ),
    verge =
        BetingetOpplysning(
            svar = EnumSvar(JA, "Ja"),
            opplysning =
                Verge(
                    fornavn = Opplysning("Verge"),
                    etternavn = Opplysning("Vergeson"),
                    foedselsnummer = Opplysning(Foedselsnummer.of("24014021406")),
                ),
        ),
)

fun avdoedMedUtenlandsopphold(foedselsnummer: Foedselsnummer? = null) =
    Avdoed(
        fornavn = Opplysning("Petter"),
        etternavn = Opplysning("Hansen"),
        foedselsnummer = Opplysning(foedselsnummer ?: Foedselsnummer.of("24014021406")),
        datoForDoedsfallet = Opplysning(DatoSvar(LocalDate.now())),
        statsborgerskap = Opplysning(FritekstSvar("Norsk")),
        utenlandsopphold =
            BetingetOpplysning(
                svar = EnumSvar(JA, "Ja"),
                opplysning =
                    listOf(
                        Utenlandsopphold(
                            land = Opplysning(FritekstSvar("Danmark")),
                            fraDato = Opplysning(DatoSvar(LocalDate.now().minusYears(10))),
                            tilDato = Opplysning(DatoSvar(LocalDate.now().minusYears(5))),
                            oppholdsType =
                                Opplysning(
                                    listOf(
                                        EnumSvar(OppholdUtlandType.ARBEIDET, "Arbeidet"),
                                        EnumSvar(OppholdUtlandType.BODD, "Bodd"),
                                    ),
                                ),
                            medlemFolketrygd = Opplysning(EnumSvar(JA, "Ja")),
                            pensjonsutbetaling = Opplysning(FritekstSvar("150000")),
                        ),
                    ),
            ),
        militaertjeneste =
            BetingetOpplysning(
                svar = EnumSvar(JA, "Ja"),
                opplysning = Opplysning(FritekstSvar("2015, 2016")),
            ),
        doedsaarsakSkyldesYrkesskadeEllerYrkessykdom = Opplysning(EnumSvar(JA, "Ja")),
    )