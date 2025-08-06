import { differenceInYears } from 'date-fns'
import { TFunction } from 'i18next'
import { skalViseAFPFelter } from '~components/soknad/6-inntekten-din/fragmenter/afp'
import { skalViseAFPOffentligFelter } from '~components/soknad/6-inntekten-din/fragmenter/PensjonEllerUfoere'
import { FeatureToggleNavn, FeatureToggleStatus } from '~context/featureToggle/FeatureToggleContext'
import { finnFeatureToggle } from '~context/featureToggle/featureToggle'
import { IBruker } from '../../context/bruker/bruker'
import { ISoeknad } from '../../context/soknad/soknad'
import { ISelvstendigNaeringsdrivende, StillingType } from '../../typer/arbeidsforhold'
import {
    EndringAvInntektGrunn,
    GrunnTilPaavirkelseAvInntekt,
    IForventerEndringAvInntekt,
    IInntekt,
    InntektEllerUtbetaling,
    InntektsTyper,
    NorgeOgUtland,
    PensjonEllerTrygd,
    PensjonsYtelse,
} from '../../typer/inntekt'
import { IForholdAvdoede, INySivilstatus, ISituasjonenDin, Sivilstatus } from '../../typer/person'
import { IValg } from '../../typer/Spoersmaal'
import { IMerOmSituasjonenDin, JobbStatus } from '../../typer/situasjon'
import { Studieform } from '../../typer/utdanning'
import { fullAdresse } from '../../utils/adresse'
import { doedsdatoErIAar, erMellomOktoberogDesember } from '../../utils/dato'
import {
    AnnenSituasjon,
    ArbeidOgUtdanning,
    Arbeidssoeker,
    Arbeidstaker,
    BetingetOpplysning,
    DatoSvar,
    EndringAvInntekt,
    EnumSvar,
    EtablererVirksomhet,
    ForholdTilAvdoede,
    ForholdTilAvdoedeType,
    ForventetInntektIAar,
    ForventetInntektTilNesteAar,
    FritekstSvar,
    HoeyesteUtdanning,
    IngenInntekt,
    InntektFremTilDoedsfallet,
    InntektOgPensjon,
    InntektViaYtelserFraNAV,
    JaNeiVetIkke,
    Kontaktinfo,
    LoennsOgNaeringsinntekt,
    OppholdUtland,
    Opplysning,
    PensjonEllerUfoere,
    SelvstendigNaeringsdrivende,
    SivilstatusType,
    SkalGaaAvMedAlderspensjon,
    Stoenader,
    TilbudOmJobb,
    Utdanning,
    YtelserAndre,
    YtelserNav,
} from '../dto/FellesOpplysninger'
import { Gjenlevende, PersonType, Samboer } from '../dto/Person'
import { valgTilSvar } from './fellesMapper'
import {
    konverterEndringAvInntektGrunn,
    konverterGrunnTilPaavirkelseAvInntekt,
    konverterIngenJobb,
    konverterInntektEllerUtbetaling,
    konverterJobbStatus,
    konverterNorgeEllerUtland,
    konverterPensjonEllerTrygd,
    konverterPensjonsYtelse,
    konverterRelasjonAvdoed,
    konverterSivilstatus,
    konverterSoekteYtelserAndre,
    konverterSoekteYtelserNAV,
    konverterStillingType,
    konverterStudieform,
    konverterTilHoyesteUtdanning,
} from './typeMapper'

export const mapGjenlevende = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Gjenlevende => {
    const kontaktinfo: Kontaktinfo = {
        telefonnummer: {
            spoersmaal: bruker.telefonnummer ? t('felles.telefonnummer') : t('omDeg.kontaktinfo.telefonnummer'),
            svar: {
                innhold: bruker.telefonnummer || soeknad.omDeg.kontaktinfo!.telefonnummer || '-',
            },
        },
    }

    const flyktning = !!soeknad.omDeg.flyktning
        ? {
              spoersmaal: t('omDeg.flyktning'),
              svar: valgTilSvar(t, soeknad.omDeg.flyktning),
          }
        : undefined

    // TODO: Slå sammen med ArbeidOgUtdanning ... ?
    const fullfoertUtdanning: Opplysning<EnumSvar<HoeyesteUtdanning>[]> | undefined = !bruker.adressebeskyttelse
        ? {
              spoersmaal: t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning'),
              svar:
                  soeknad.merOmSituasjonenDin.utdanning!.hoyesteFullfoerteUtdanning!.map((type) => ({
                      verdi: konverterTilHoyesteUtdanning(type),
                      innhold: t(type),
                  })) || [],
          }
        : undefined

    return {
        type: PersonType.GJENLEVENDE_OMS,

        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: bruker.fornavn!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: bruker.etternavn!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: bruker.foedselsnummer!,
        },

        statsborgerskap: {
            spoersmaal: t('felles.statsborgerskap'),
            svar: `${bruker.statsborgerskap}`,
        },
        sivilstatus: {
            spoersmaal: t('felles.sivilstatus'),
            svar: t(`pdl.sivilstatus.${bruker.sivilstatus}`) || `${bruker.sivilstatus}`,
        },

        adresse: !bruker.adressebeskyttelse
            ? {
                  spoersmaal: t('felles.adresse'),
                  svar: fullAdresse(bruker),
              }
            : undefined,
        bostedsAdresse:
            !bruker.adressebeskyttelse && soeknad.omDeg.alternativAdresse
                ? {
                      spoersmaal: t('omDeg.alternativAdresse'),
                      svar: {
                          innhold: soeknad.omDeg.alternativAdresse!,
                      },
                  }
                : undefined,
        kontaktinfo,
        flyktning,
        oppholdUtland: !bruker.adressebeskyttelse ? hentOppholdUtland(t, soeknad.situasjonenDin) : undefined,
        nySivilstatus: hentSivilstatus(t, soeknad.situasjonenDin.nySivilstatus!),
        arbeidOgUtdanning: !bruker.adressebeskyttelse
            ? hentArbeidOgUtdanning(t, soeknad.merOmSituasjonenDin)
            : undefined,
        fullfoertUtdanning,
        inntektOgPensjon: hentInntektOgPensjon(
            t,
            soeknad.inntektenDin,
            soeknad.omDenAvdoede.datoForDoedsfallet!,
            bruker
        ),
        uregistrertEllerVenterBarn: {
            spoersmaal: t('situasjonenDin.gravidEllerNyligFoedt'),
            svar: valgTilSvar(t, soeknad.situasjonenDin.gravidEllerNyligFoedt!),
        },
        forholdTilAvdoede: mapForholdTilAvdoede(t, soeknad.omDegOgAvdoed.forholdTilAvdoede!),
        omsorgForBarn: {
            spoersmaal: t('situasjonenDin.omsorgMinstFemti'),
            svar: valgTilSvar(t, soeknad.situasjonenDin.omsorgMinstFemti!),
        },
    }
}

export const mapStoenader = (t: TFunction, soeknad: ISoeknad): Opplysning<EnumSvar<Stoenader>>[] => {
    const stoenader: Opplysning<EnumSvar<Stoenader>>[] = []

    if (soeknad.merOmSituasjonenDin.utdanning?.soeknadOmSkolepenger) {
        stoenader.push({
            spoersmaal: t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger'),
            svar: {
                innhold: t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.bekreftelse'),
                verdi: Stoenader.SKOLEPENGER,
            },
        })
    }

    if (soeknad.merOmSituasjonenDin.utdanning?.soeknadOmTilleggsstoenadUtdanning) {
        stoenader.push({
            spoersmaal: t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning'),
            svar: {
                innhold: t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse'),
                verdi: Stoenader.TILLEGGSSTOENAD_UTDANNING,
            },
        })
    }

    if (soeknad.opplysningerOmBarn.soeknadOmBarnetilsyn) {
        stoenader.push({
            spoersmaal: t('omBarn.soeknadOmBarnetilsyn'),
            svar: {
                innhold: t('omBarn.soeknadOmBarnetilsyn.bekreftelse'),
                verdi: Stoenader.BARNETILSYN,
            },
        })
    }

    if (soeknad.opplysningerOmBarn.soeknadOmTilleggsstoenadBarnepass) {
        stoenader.push({
            spoersmaal: t('omBarn.soeknadOmTilleggsstoenadBarnepass'),
            svar: {
                innhold: t('omBarn.soeknadOmTilleggsstoenadBarnepass.bekreftelse'),
                verdi: Stoenader.TILLEGGSSTOENAD_BARNEPASS,
            },
        })
    }

    return stoenader
}

const hentOppholdUtland = (
    t: TFunction,
    situasjonenDin: ISituasjonenDin
): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland> => {
    let opplysning: OppholdUtland | undefined

    if (situasjonenDin.bosattINorge === IValg.JA) {
        opplysning = {
            oppholderSegIUtlandet: {
                spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.svar'),
                svar: valgTilSvar(t, situasjonenDin.oppholderSegIUtlandet!.svar!),
            },
            oppholdsland:
                situasjonenDin.oppholderSegIUtlandet!.svar! === IValg.JA
                    ? {
                          spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.oppholdsland'),
                          svar: {
                              innhold: situasjonenDin.oppholderSegIUtlandet!.oppholdsland!,
                          },
                      }
                    : undefined,
            oppholdFra:
                situasjonenDin.oppholderSegIUtlandet!.svar! === IValg.JA &&
                situasjonenDin.oppholderSegIUtlandet!.oppholdFra
                    ? {
                          spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.oppholdFra'),
                          svar: {
                              innhold: situasjonenDin.oppholderSegIUtlandet!.oppholdFra!,
                          },
                      }
                    : undefined,
            oppholdTil:
                situasjonenDin.oppholderSegIUtlandet!.svar! === IValg.JA &&
                situasjonenDin.oppholderSegIUtlandet!.oppholdTil
                    ? {
                          spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.oppholdTil'),
                          svar: {
                              innhold: situasjonenDin.oppholderSegIUtlandet!.oppholdTil!,
                          },
                      }
                    : undefined,
        }
    }

    if (situasjonenDin.bosattINorge === IValg.NEI) {
        opplysning = {
            bosattLand: {
                spoersmaal: t('situasjonenDin.bosattLand'),
                svar: {
                    innhold: situasjonenDin.bosattLand!,
                },
            },
        }
    }

    return {
        spoersmaal: t('situasjonenDin.bosattINorge'),
        svar: valgTilSvar(t, situasjonenDin.bosattINorge!),
        opplysning,
    }
}

const hentSivilstatus = (
    t: TFunction,
    nySivilstatus: INySivilstatus
): BetingetOpplysning<EnumSvar<SivilstatusType>, Samboer> => {
    let opplysning: Samboer | undefined

    if (nySivilstatus?.sivilstatus == Sivilstatus.samboerskap) {
        const samboer = nySivilstatus.samboerskap!.samboer!

        opplysning = {
            type: PersonType.SAMBOER,
            fornavn: {
                spoersmaal: t('felles.fornavn'),
                svar: samboer.fornavn!,
            },
            etternavn: {
                spoersmaal: t('felles.etternavn'),
                svar: samboer.etternavn!,
            },
            foedselsnummer: {
                spoersmaal: t('felles.foedselsnummer'),
                svar: samboer.foedselsnummer!,
            },
            fellesBarnEllertidligereGift: {
                spoersmaal: t('situasjonenDin.nySivilstatus.samboerskap.hattBarnEllerVaertGift'),
                svar: valgTilSvar(t, nySivilstatus.samboerskap!.hattBarnEllerVaertGift!),
            },
        }
    }

    return {
        spoersmaal: t('situasjonenDin.nySivilstatus.sivilstatus'),
        svar: {
            verdi: konverterSivilstatus(nySivilstatus!.sivilstatus!),
            innhold: t(nySivilstatus!.sivilstatus!),
        },
        opplysning,
    }
}

const hentArbeidOgUtdanning = (t: TFunction, dinSituasjon: IMerOmSituasjonenDin): ArbeidOgUtdanning => {
    let arbeidsforhold: Opplysning<Arbeidstaker[]> | undefined

    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidstaker)) {
        arbeidsforhold = {
            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.tittel'),
            svar:
                dinSituasjon.arbeidsforhold?.map((arbeid) => {
                    const arbeidstaker: Arbeidstaker = {
                        arbeidsgiver: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsgiver'),
                            svar: {
                                innhold: arbeid.arbeidsgiver!,
                            },
                        },
                        arbeidsmengde:
                            arbeid.ansettelsesforhold === StillingType.fast
                                ? {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar.fast'),
                                      svar: {
                                          innhold: `${arbeid.arbeidsmengde!.svar!} ${t('felles.prosent')}`,
                                      },
                                  }
                                : {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar'),
                                      svar: {
                                          innhold: `${arbeid.arbeidsmengde!.svar!} ${t(arbeid.arbeidsmengde!.type!)}`,
                                      },
                                  },
                        ansettelsesforhold: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold'),
                            svar: {
                                verdi: konverterStillingType(arbeid.ansettelsesforhold!),
                                innhold: t(arbeid.ansettelsesforhold!),
                            },
                        },
                        harSluttdato:
                            arbeid?.ansettelsesforhold === StillingType.midlertidig ||
                            arbeid?.ansettelsesforhold === StillingType.tilkallingsvikar
                                ? {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.midlertidig.svar'),
                                      svar: valgTilSvar(t, arbeid!.midlertidig!.svar!),
                                  }
                                : undefined,
                        sluttdato:
                            arbeid?.midlertidig?.svar === IValg.JA
                                ? {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.midlertidig.sluttdatoVelger'),
                                      svar: {
                                          innhold: arbeid!.midlertidig!.sluttdatoVelger!,
                                      },
                                  }
                                : undefined,
                        endretArbeidssituasjon: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.svar'),
                            svar: valgTilSvar(t, arbeid.forventerEndretArbeidssituasjon!.svar!),
                            opplysning:
                                arbeid.forventerEndretArbeidssituasjon?.svar === IValg.JA
                                    ? {
                                          spoersmaal: t(
                                              'merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse'
                                          ),
                                          svar: {
                                              innhold: t(arbeid.forventerEndretArbeidssituasjon.beskrivelse!),
                                          },
                                      }
                                    : undefined,
                        },
                        /*sagtOppEllerRedusert: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.sagtOppEllerRedusert.svar'),
                            svar: {
                                verdi: konverterSagtOppEllerRedusert(arbeid.sagtOppEllerRedusert!.svar!),
                                innhold: t(arbeid.sagtOppEllerRedusert!.svar!),
                            },
                        },*/
                    }

                    return arbeidstaker
                }) || [],
        }
    }

    let selvstendig: Opplysning<SelvstendigNaeringsdrivende[]> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendig)) {
        const selvstendigListe: SelvstendigNaeringsdrivende[] =
            dinSituasjon.selvstendig?.map((naering) => {
                return mapSelvstendigNæringsdrivende(t, naering)
            }) || []

        selvstendig = {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.tittel'),
            svar: selvstendigListe,
        }
    }

    let etablererVirksomhet: Opplysning<EtablererVirksomhet> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.etablerer)) {
        etablererVirksomhet = {
            spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.tittel'),
            svar: {
                virksomheten: {
                    spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.hvaHeterVirksomheten'),
                    svar: {
                        innhold: dinSituasjon.etablererVirksomhet!.hvaHeterVirksomheten!,
                    },
                },
                orgnr: {
                    spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.orgnr'),
                    svar: {
                        innhold: dinSituasjon.etablererVirksomhet?.manglerOrgnr?.length
                            ? dinSituasjon.etablererVirksomhet.manglerOrgnr[0]
                            : dinSituasjon.etablererVirksomhet!.orgnr!,
                    },
                },
                forretningsplan: {
                    spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.svar'),
                    svar: valgTilSvar(t, dinSituasjon.etablererVirksomhet!.forretningsplan!.svar!),
                },
                samarbeidMedNav:
                    dinSituasjon.etablererVirksomhet?.forretningsplan?.svar === IValg.JA
                        ? {
                              spoersmaal: t(
                                  'merOmSituasjonenDin.etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar'
                              ),
                              svar: valgTilSvar(
                                  t,
                                  dinSituasjon!.etablererVirksomhet!.forretningsplan!.samarbeidMedNAV!.svar!
                              ),
                          }
                        : undefined,
            },
        }
    }

    let tilbud: Opplysning<TilbudOmJobb> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.tilbud)) {
        const fastAnsettelse = dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.fast

        tilbud = {
            spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.tittel'),
            svar: {
                nyttArbeidssted: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.arbeidssted'),
                    svar: {
                        innhold: dinSituasjon.tilbudOmJobb!.arbeidssted!,
                    },
                },
                ansettelsesdato: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesdato'),
                    svar: {
                        innhold: dinSituasjon!.tilbudOmJobb!.ansettelsesdato!,
                    },
                },
                ansettelsesforhold: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold'),
                    svar: {
                        verdi: konverterStillingType(dinSituasjon.tilbudOmJobb!.ansettelsesforhold!),
                        innhold: t(dinSituasjon.tilbudOmJobb!.ansettelsesforhold!),
                    },
                },
                arbeidsmengde: fastAnsettelse
                    ? {
                          spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar.fast'),
                          svar: {
                              innhold: `${dinSituasjon.tilbudOmJobb!.arbeidsmengde!.svar!} ${t('felles.prosent')}`,
                          },
                      }
                    : {
                          spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar'),
                          svar: {
                              innhold: `${dinSituasjon.tilbudOmJobb!.arbeidsmengde!.svar!} ${t(
                                  dinSituasjon.tilbudOmJobb!.arbeidsmengde!.type!
                              )}`,
                          },
                      },
                harSluttdato:
                    dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.midlertidig ||
                    dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.tilkallingsvikar
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.svar'),
                              svar: valgTilSvar(t, dinSituasjon.tilbudOmJobb!.midlertidig!.svar!),
                          }
                        : undefined,
                sluttdato:
                    dinSituasjon.tilbudOmJobb?.midlertidig?.svar === IValg.JA
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.sluttdatoVelger'),
                              svar: {
                                  innhold: dinSituasjon!.tilbudOmJobb!.midlertidig!.sluttdatoVelger!,
                              },
                          }
                        : undefined,
                aktivitetsplan: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.aktivitetsplan.svar'),
                    svar: valgTilSvar(t, dinSituasjon.tilbudOmJobb!.aktivitetsplan.svar!),
                },
            },
        }
    }

    let arbeidssoeker: Opplysning<Arbeidssoeker> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidssoeker)) {
        arbeidssoeker = {
            spoersmaal: t('merOmSituasjonenDin.arbeidssoeker.tittel'),
            svar: {
                registrertArbeidssoeker: {
                    spoersmaal: t('merOmSituasjonenDin.arbeidssoeker.svar'),
                    svar: valgTilSvar(t, dinSituasjon.arbeidssoeker!.svar!),
                },
                aktivitetsplan:
                    dinSituasjon.arbeidssoeker!.svar === IValg.JA
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.arbeidssoeker.aktivitetsplan.svar'),
                              svar: valgTilSvar(t, dinSituasjon.arbeidssoeker!.aktivitetsplan.svar!),
                          }
                        : undefined,
            },
        }
    }

    let utdanning: Opplysning<Utdanning> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.underUtdanning)) {
        utdanning = {
            spoersmaal: t('merOmSituasjonenDin.utdanning.tittel'),
            svar: {
                studiested: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studiested'),
                    svar: {
                        innhold: dinSituasjon.utdanning!.naavaerendeUtdanning!.studiested!,
                    },
                },
                studie: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studie'),
                    svar: {
                        innhold: dinSituasjon.utdanning!.naavaerendeUtdanning!.studie!,
                    },
                },
                studieform: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieform'),
                    svar: {
                        innhold: t(dinSituasjon.utdanning!.naavaerendeUtdanning!.studieform!),
                        verdi: konverterStudieform(dinSituasjon.utdanning!.naavaerendeUtdanning!.studieform!),
                    },
                },
                studieprosent:
                    dinSituasjon.utdanning!.naavaerendeUtdanning!.studieform === Studieform.deltid
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent'),
                              svar: {
                                  innhold: dinSituasjon.utdanning!.naavaerendeUtdanning!.studieprosent!,
                              },
                          }
                        : undefined,
                startDato: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.startDato'),
                    svar: {
                        innhold: dinSituasjon.utdanning!.naavaerendeUtdanning!.startDato!,
                    },
                },
                sluttDato: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.sluttDato'),
                    svar: {
                        innhold: dinSituasjon.utdanning!.naavaerendeUtdanning!.sluttDato!,
                    },
                },
                godkjentUtdanning: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.godkjentUtdanning'),
                    svar: valgTilSvar(t, dinSituasjon.utdanning!.naavaerendeUtdanning!.godkjentUtdanning!),
                },
                aktivitetsplan: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.aktivitetsplan.svar'),
                    svar: valgTilSvar(t, dinSituasjon.utdanning!.aktivitetsplan!.svar!),
                },
            },
        }
    }

    let annenSituasjon: Opplysning<AnnenSituasjon> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.ingen)) {
        annenSituasjon = {
            spoersmaal: t('merOmSituasjonenDin.annenSituasjon.tittel'),
            svar: {
                beskrivelse: {
                    spoersmaal: t('merOmSituasjonenDin.annenSituasjon.beskrivelse'),
                    svar:
                        dinSituasjon.annenSituasjon!.beskrivelse!.map((type) => ({
                            verdi: konverterIngenJobb(type),
                            innhold: t(type),
                        })) || [],
                },
                annet: dinSituasjon.annenSituasjon!.annet?.beskrivelse
                    ? {
                          spoersmaal: t('merOmSituasjonenDin.selvstendig.forventerEndretInntekt.beskrivelse'),
                          svar: {
                              innhold: `${dinSituasjon.annenSituasjon!.annet!.beskrivelse}`,
                          },
                      }
                    : undefined,
            },
        }
    }

    return {
        dinSituasjon: {
            spoersmaal: t('merOmSituasjonenDin.jobbStatus'),
            svar:
                dinSituasjon.jobbStatus?.map((type) => ({
                    verdi: konverterJobbStatus(type),
                    innhold: t(type),
                })) || [],
        },
        arbeidsforhold,
        selvstendig,
        etablererVirksomhet,
        tilbud,
        arbeidssoeker,
        utdanning,
        annenSituasjon,
    }
}

const hentInntektOgPensjon = (
    t: TFunction,
    inntektenDin: IInntekt,
    datoForDoedsfall: Date,
    bruker: IBruker
): InntektOgPensjon => {
    const doedsfallIAar = doedsdatoErIAar(datoForDoedsfall)
    const foedt1963EllerTidligere = bruker.foedselsaar! <= 1963
    const harMulighetTilAaGaaAvMedAlderspensjon = differenceInYears(new Date(), bruker.foedselsdato!) >= 62
    const erIkkeDesember = new Date(datoForDoedsfall).getMonth() !== 11

    let skalGaaAvMedAlderspensjon: SkalGaaAvMedAlderspensjon | undefined
    let inntektFremTilDoedsfallet: Opplysning<InntektFremTilDoedsfallet> | undefined
    let forventetInntektIAar: Opplysning<ForventetInntektIAar> | undefined
    let forventetInntektTilNesteAar: Opplysning<ForventetInntektTilNesteAar> | undefined

    finnFeatureToggle(FeatureToggleNavn.OMS_SOEKNAD_NYTT_INNTEKT_STEG).then((data) => {
        if (data.status === FeatureToggleStatus.PAA) {
            // TODO NYE DATASTRUKTUR FOR INNTEKT
            if (harMulighetTilAaGaaAvMedAlderspensjon) {
                skalGaaAvMedAlderspensjon = {
                    valg: {
                        spoersmaal: erMellomOktoberogDesember()
                            ? t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektTilNesteAar')
                            : t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar'),
                        svar: valgTilSvar(t, inntektenDin.skalGaaAvMedAlderspensjon!.valg!),
                    },
                    datoForAaGaaAvMedAlderspensjon:
                        inntektenDin.skalGaaAvMedAlderspensjon!.valg! === IValg.JA
                            ? {
                                  spoersmaal: t(
                                      'inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'
                                  ),
                                  svar: {
                                      innhold: inntektenDin.skalGaaAvMedAlderspensjon!.datoForAaGaaAvMedAlderspensjon!,
                                  },
                              }
                            : undefined,
                }
            }

            inntektFremTilDoedsfallet = {
                spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.tittel'),
                svar: {
                    arbeidsinntekt: {
                        spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.arbeidsinntekt'),
                        svar: { innhold: inntektenDin.inntektFremTilDoedsfallet!.arbeidsinntekt! },
                    },
                    naeringsinntekt: {
                        inntekt: {
                            spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.inntekt'),
                            svar: { innhold: inntektenDin.inntektFremTilDoedsfallet!.naeringsinntekt!.inntekt! },
                        },
                        erNaeringsinntektOpptjentJevnt:
                            !!inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt &&
                            inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt !== '0'
                                ? {
                                      valg: {
                                          spoersmaal: t(
                                              'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                          ),
                                          svar: valgTilSvar(
                                              t,
                                              inntektenDin.inntektFremTilDoedsfallet!.naeringsinntekt!
                                                  .erNaeringsinntektOpptjentJevnt!.valg!
                                          ),
                                      },
                                      beskrivelse:
                                          inntektenDin.inntektFremTilDoedsfallet!.naeringsinntekt!
                                              .erNaeringsinntektOpptjentJevnt!.valg! === IValg.NEI
                                              ? {
                                                    spoersmaal: t(
                                                        'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                                    ),
                                                    svar: {
                                                        innhold:
                                                            inntektenDin.inntektFremTilDoedsfallet!.naeringsinntekt!
                                                                .erNaeringsinntektOpptjentJevnt!.beskrivelse!,
                                                    },
                                                }
                                              : undefined,
                                  }
                                : undefined,
                    },
                    afpInntekt: skalViseAFPFelter(bruker)
                        ? {
                              inntekt: {
                                  spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.afpInntekt.inntekt'),
                                  svar: { innhold: inntektenDin.inntektFremTilDoedsfallet!.afpInntekt!.inntekt! },
                              },
                              tjenesteordning:
                                  !!inntektenDin.inntektFremTilDoedsfallet?.afpInntekt?.inntekt &&
                                  inntektenDin.inntektFremTilDoedsfallet?.afpInntekt?.inntekt !== '0'
                                      ? {
                                            spoersmaal: t(
                                                'inntektenDin.inntektFremTilDoedsfallet.afpInntekt.tjenesteordning'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.inntektFremTilDoedsfallet!.afpInntekt!
                                                        .tjenesteordning!,
                                            },
                                        }
                                      : undefined,
                          }
                        : undefined,
                    inntektFraUtland: {
                        spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.inntektFraUtland'),
                        svar: { innhold: inntektenDin.inntektFremTilDoedsfallet!.inntektFraUtland! },
                    },
                    andreInntekter: {
                        valg: {
                            spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.valg'),
                            svar: valgTilSvar(t, inntektenDin.inntektFremTilDoedsfallet!.andreInntekter!.valg!),
                        },
                        inntekt:
                            inntektenDin.inntektFremTilDoedsfallet!.andreInntekter!.valg === IValg.JA
                                ? {
                                      spoersmaal: t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.inntekt'),
                                      svar: {
                                          innhold: inntektenDin.inntektFremTilDoedsfallet!.andreInntekter!.inntekt!,
                                      },
                                  }
                                : undefined,
                        beskrivelse:
                            inntektenDin.inntektFremTilDoedsfallet!.andreInntekter!.valg === IValg.JA
                                ? {
                                      spoersmaal: t(
                                          'inntektenDin.inntektFremTilDoedsfallet.andreInntekter.beskrivelse'
                                      ),
                                      svar: {
                                          innhold: inntektenDin.inntektFremTilDoedsfallet!.andreInntekter!.beskrivelse!,
                                      },
                                  }
                                : undefined,
                    },
                },
            }

            forventetInntektIAar = {
                spoersmaal: t('inntektenDin.forventetInntektIAar.tittel'),
                svar: {
                    arbeidsinntekt: {
                        spoersmaal: t('inntektenDin.forventetInntektIAar.arbeidsinntekt'),
                        svar: { innhold: inntektenDin.forventetInntektIAar!.arbeidsinntekt! },
                    },
                    naeringsinntekt: {
                        inntekt: {
                            spoersmaal: t('forventetInntektIAar.naeringsinntekt.inntekt'),
                            svar: { innhold: inntektenDin.forventetInntektIAar!.naeringsinntekt!.inntekt! },
                        },
                        erNaeringsinntektOpptjentJevnt:
                            !!inntektenDin.forventetInntektIAar?.naeringsinntekt?.inntekt &&
                            inntektenDin.forventetInntektIAar?.naeringsinntekt?.inntekt !== '0'
                                ? {
                                      valg: {
                                          spoersmaal: t(
                                              'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                          ),
                                          svar: valgTilSvar(
                                              t,
                                              inntektenDin.forventetInntektIAar!.naeringsinntekt!
                                                  .erNaeringsinntektOpptjentJevnt!.valg!
                                          ),
                                      },
                                      beskrivelse:
                                          inntektenDin.forventetInntektIAar.naeringsinntekt
                                              .erNaeringsinntektOpptjentJevnt?.valg === IValg.NEI
                                              ? {
                                                    spoersmaal: t(
                                                        'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beksrivelse'
                                                    ),
                                                    svar: {
                                                        innhold:
                                                            inntektenDin.forventetInntektIAar!.naeringsinntekt!
                                                                .erNaeringsinntektOpptjentJevnt!.beskrivelse!,
                                                    },
                                                }
                                              : undefined,
                                  }
                                : undefined,
                    },
                    afpInntekt: skalViseAFPFelter(bruker)
                        ? {
                              inntekt: {
                                  spoersmaal: t('inntektenDin.forventetInntektIAar.afpInntekt.tjenesteordning'),
                                  svar: { innhold: inntektenDin.forventetInntektIAar!.afpInntekt!.inntekt! },
                              },
                              tjenesteordning:
                                  !!inntektenDin.forventetInntektIAar?.afpInntekt?.inntekt &&
                                  inntektenDin.forventetInntektIAar?.afpInntekt?.inntekt !== '0'
                                      ? {
                                            spoersmaal: t(
                                                'inntektenDin.forventetInntektIAar.afpInntekt.tjenesteordning'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.forventetInntektIAar!.afpInntekt!.tjenesteordning!,
                                            },
                                        }
                                      : undefined,
                          }
                        : undefined,
                    inntektFraUtland: {
                        spoersmaal: t('inntektenDin.forventetInntektIAar.inntektFraUtland'),
                        svar: { innhold: inntektenDin.forventetInntektIAar!.inntektFraUtland! },
                    },
                    andreInntekter: {
                        valg: {
                            spoersmaal: t('inntektenDin.forventetInntektIAar.andreInntekter.inntekt'),
                            svar: valgTilSvar(t, inntektenDin.forventetInntektIAar!.andreInntekter!.valg!),
                        },
                        inntekt:
                            inntektenDin.forventetInntektIAar!.andreInntekter!.valg === IValg.JA
                                ? {
                                      spoersmaal: t('inntektenDin.forventetInntektIAar.andreInntekter.inntekt'),
                                      svar: { innhold: inntektenDin.forventetInntektIAar!.andreInntekter!.inntekt! },
                                  }
                                : undefined,
                        beskrivelse:
                            inntektenDin.forventetInntektIAar!.andreInntekter!.valg === IValg.JA
                                ? {
                                      spoersmaal: t('inntektenDin.forventetInntektIAar.andreInntekter.beskrivelse'),
                                      svar: {
                                          innhold: inntektenDin.forventetInntektIAar!.andreInntekter!.beskrivelse!,
                                      },
                                  }
                                : undefined,
                    },
                    noeSomKanPaavirkeInntekten: {
                        valg: {
                            spoersmaal: t('inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.valg'),
                            svar: valgTilSvar(t, inntektenDin.forventetInntektIAar!.noeSomKanPaavirkeInntekten!.valg!),
                        },
                        grunnTilPaavirkelseAvInntekt:
                            inntektenDin.forventetInntektIAar!.noeSomKanPaavirkeInntekten!.valg! === IValg.JA
                                ? {
                                      spoersmaal: t(
                                          'inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                                      ),
                                      svar: {
                                          verdi: konverterGrunnTilPaavirkelseAvInntekt(
                                              inntektenDin.forventetInntektIAar!.noeSomKanPaavirkeInntekten!
                                                  .grunnTilPaavirkelseAvInntekt!
                                          ),
                                          innhold: t(
                                              inntektenDin.forventetInntektIAar!.noeSomKanPaavirkeInntekten!
                                                  .grunnTilPaavirkelseAvInntekt!
                                          ),
                                      },
                                  }
                                : undefined,
                        beskrivelse:
                            inntektenDin.forventetInntektIAar!.noeSomKanPaavirkeInntekten!
                                .grunnTilPaavirkelseAvInntekt === GrunnTilPaavirkelseAvInntekt.annenGrunn
                                ? {
                                      spoersmaal: t(
                                          'inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.beskrivelse'
                                      ),
                                      svar: {
                                          innhold:
                                              inntektenDin.forventetInntektIAar!.noeSomKanPaavirkeInntekten!
                                                  .beskrivelse!,
                                      },
                                  }
                                : undefined,
                    },
                },
            }

            if (erMellomOktoberogDesember()) {
                forventetInntektTilNesteAar = {
                    spoersmaal: t('inntektenDin.forventetInntektTilNesteAar.tittel'),
                    svar: {
                        arbeidsinntekt: {
                            spoersmaal: t('inntektenDin.forventetInntektTilNesteAar.arbeidsinntekt'),
                            svar: { innhold: inntektenDin.forventetInntektTilNesteAar!.arbeidsinntekt! },
                        },
                        naeringsinntekt: {
                            inntekt: {
                                spoersmaal: t('inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.inntekt'),
                                svar: { innhold: inntektenDin.forventetInntektTilNesteAar!.naeringsinntekt!.inntekt! },
                            },
                            erNaeringsinntektOpptjentJevnt:
                                !!inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt?.inntekt &&
                                inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt?.inntekt !== '0'
                                    ? {
                                          valg: {
                                              spoersmaal: t(
                                                  'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                              ),
                                              svar: valgTilSvar(
                                                  t,
                                                  inntektenDin.forventetInntektTilNesteAar!.naeringsinntekt!
                                                      .erNaeringsinntektOpptjentJevnt!.valg!
                                              ),
                                          },
                                          beskrivelse: {
                                              spoersmaal: t(
                                                  'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.forventetInntektTilNesteAar!.naeringsinntekt!
                                                          .erNaeringsinntektOpptjentJevnt!.beskrivelse!,
                                              },
                                          },
                                      }
                                    : undefined,
                        },
                        afpInntekt: skalViseAFPFelter(bruker)
                            ? {
                                  inntekt: {
                                      spoersmaal: t('inntektenDin.forventetInntektTilNesteAar.afpInntekt.inntekt'),
                                      svar: { innhold: inntektenDin.forventetInntektTilNesteAar!.afpInntekt!.inntekt! },
                                  },
                                  tjenesteordning:
                                      !!inntektenDin.forventetInntektIAar?.afpInntekt?.inntekt &&
                                      inntektenDin.forventetInntektIAar?.afpInntekt?.inntekt !== '0'
                                          ? {
                                                spoersmaal: t(
                                                    'inntektenDin.forventetInntektTilNesteAar.afpInntekt.tjenesteordning'
                                                ),
                                                svar: {
                                                    innhold:
                                                        inntektenDin.forventetInntektTilNesteAar!.afpInntekt!
                                                            .tjenesteordning!,
                                                },
                                            }
                                          : undefined,
                              }
                            : undefined,
                        inntektFraUtland: {
                            spoersmaal: t('inntektenDin.forventetInntektTilNesteAar.inntektFraUtland'),
                            svar: { innhold: inntektenDin.forventetInntektTilNesteAar!.inntektFraUtland! },
                        },
                        andreInntekter: {
                            valg: {
                                spoersmaal: t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.valg'),
                                svar: valgTilSvar(t, inntektenDin.forventetInntektTilNesteAar!.andreInntekter!.valg!),
                            },
                            inntekt:
                                inntektenDin.forventetInntektTilNesteAar!.andreInntekter!.valg === IValg.JA
                                    ? {
                                          spoersmaal: t(
                                              'inntektenDin.forventetInntektTilNesteAar.andreInntekter.inntekt'
                                          ),
                                          svar: {
                                              innhold:
                                                  inntektenDin.forventetInntektTilNesteAar!.andreInntekter!.inntekt!,
                                          },
                                      }
                                    : undefined,
                            beskrivelse:
                                inntektenDin.forventetInntektTilNesteAar!.andreInntekter!.valg === IValg.JA
                                    ? {
                                          spoersmaal: t(
                                              'inntektenDin.forventetInntektTilNesteAar.andreInntekter.beskrivelse'
                                          ),
                                          svar: {
                                              innhold:
                                                  inntektenDin.forventetInntektTilNesteAar!.andreInntekter!
                                                      .beskrivelse!,
                                          },
                                      }
                                    : undefined,
                        },
                        noeSomKanPaavirkeInntekten: {
                            valg: {
                                spoersmaal: t(
                                    'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg'
                                ),
                                svar: valgTilSvar(
                                    t,
                                    inntektenDin.forventetInntektTilNesteAar!.noeSomKanPaavirkeInntekten!.valg!
                                ),
                            },
                            grunnTilPaavirkelseAvInntekt:
                                inntektenDin.forventetInntektTilNesteAar!.noeSomKanPaavirkeInntekten!.valg! === IValg.JA
                                    ? {
                                          spoersmaal: t(
                                              'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                                          ),
                                          svar: {
                                              verdi: konverterGrunnTilPaavirkelseAvInntekt(
                                                  inntektenDin.forventetInntektTilNesteAar!.noeSomKanPaavirkeInntekten!
                                                      .grunnTilPaavirkelseAvInntekt!
                                              ),
                                              innhold: t(
                                                  inntektenDin.forventetInntektTilNesteAar!.noeSomKanPaavirkeInntekten!
                                                      .grunnTilPaavirkelseAvInntekt!
                                              ),
                                          },
                                      }
                                    : undefined,
                            beskrivelse:
                                inntektenDin.forventetInntektTilNesteAar!.noeSomKanPaavirkeInntekten!
                                    .grunnTilPaavirkelseAvInntekt === GrunnTilPaavirkelseAvInntekt.annenGrunn
                                    ? {
                                          spoersmaal: t(
                                              'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.beskrivelse'
                                          ),
                                          svar: {
                                              innhold:
                                                  inntektenDin.forventetInntektTilNesteAar!.noeSomKanPaavirkeInntekten!
                                                      .beskrivelse!,
                                          },
                                      }
                                    : undefined,
                        },
                    },
                }
            }
        }
    })

    // TODO GAMMLE DATASTRUKTUR FOR INNTEKT
    let loennsinntekt: Opplysning<LoennsOgNaeringsinntekt> | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.loenn)) {
        loennsinntekt = {
            spoersmaal: t('inntektenDin.loennsinntekt.tittel'),
            svar: {
                norgeEllerUtland: {
                    spoersmaal: t('inntektenDin.loennsinntekt.norgeEllerUtland'),
                    svar: inntektenDin.loennsinntekt!.norgeEllerUtland!.map((norgeEllerUtland) => ({
                        verdi: konverterNorgeEllerUtland(norgeEllerUtland),
                        innhold: t(norgeEllerUtland),
                    })),
                },
                norge: inntektenDin.loennsinntekt!.norgeEllerUtland.includes(NorgeOgUtland.norge)
                    ? {
                          inntektIFjor: doedsfallIAar
                              ? {
                                    aarsinntekt: foedt1963EllerTidligere
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.loennsinntekt!.norge!.inntektIFjor!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    tilDoedsfall: erIkkeDesember
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.loennsinntekt.norge.inntektIFjor.tilDoedsfall'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.loennsinntekt!.norge!.inntektIFjor!.tilDoedsfall!,
                                              },
                                          }
                                        : undefined,
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.norge!.inntektIFjor!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektIAar: doedsfallIAar
                              ? {
                                    tilDoedsfall: {
                                        spoersmaal: t('inntektenDin.loennsinntekt.norge.inntektIAar.tilDoedsfall'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.norge!.inntektIAar!.tilDoedsfall!,
                                        },
                                    },
                                    aarsinntekt: erIkkeDesember
                                        ? {
                                              spoersmaal: t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt'),
                                              svar: {
                                                  innhold: inntektenDin.loennsinntekt!.norge!.inntektIAar!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.norge!.inntektIAar!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektNesteAar:
                              erMellomOktoberogDesember() && doedsfallIAar
                                  ? {
                                        aarsinntekt: {
                                            spoersmaal: t(
                                                'inntektenDin.loennsinntekt.norge.inntektNesteAar.aarsinntekt'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.loennsinntekt!.norge!.inntektNesteAar!.aarsinntekt!,
                                            },
                                        },
                                    }
                                  : undefined,
                      }
                    : undefined,
                utland: inntektenDin.loennsinntekt!.norgeEllerUtland.includes(NorgeOgUtland.utland)
                    ? {
                          inntektAaretFoerDoedsfall:
                              !doedsfallIAar && foedt1963EllerTidligere
                                  ? {
                                        spoersmaal: t('inntektenDin.loennsinntekt.inntektAaretFoerDoedsfall'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.utland!.inntektAaretFoerDoedsfall!,
                                        },
                                    }
                                  : undefined,
                          inntektIFjor: doedsfallIAar
                              ? {
                                    aarsinntekt: foedt1963EllerTidligere
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.loennsinntekt!.utland!.inntektIFjor!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    tilDoedsfall: erIkkeDesember
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.loennsinntekt.utland.inntektIFjor.tilDoedsfall'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.loennsinntekt!.utland!.inntektIFjor!.tilDoedsfall!,
                                              },
                                          }
                                        : undefined,
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.utland!.inntektIFjor!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektIAar: doedsfallIAar
                              ? {
                                    tilDoedsfall: {
                                        spoersmaal: t('inntektenDin.loennsinntekt.utland.inntektIAar.tilDoedsfall'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.utland!.inntektIAar!.tilDoedsfall!,
                                        },
                                    },
                                    aarsinntekt: erIkkeDesember
                                        ? {
                                              spoersmaal: t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt'),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.loennsinntekt!.utland!.inntektIAar!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.loennsinntekt!.utland!.inntektIAar!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektNesteAar:
                              doedsfallIAar && erMellomOktoberogDesember()
                                  ? {
                                        aarsinntekt: {
                                            spoersmaal: t(
                                                'inntektenDin.loennsinntekt.utland.inntektNesteAar.aarsinntekt'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.loennsinntekt!.utland!.inntektNesteAar!.aarsinntekt!,
                                            },
                                        },
                                    }
                                  : undefined,
                      }
                    : undefined,
                endringAvInntekt: mapEndringAvInntekt(t, inntektenDin.loennsinntekt!.forventerEndringAvInntekt),
            },
        }
    }

    let naeringsinntekt: Opplysning<LoennsOgNaeringsinntekt> | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.naering)) {
        naeringsinntekt = {
            spoersmaal: t('inntektenDin.naeringsinntekt.tittel'),
            svar: {
                norgeEllerUtland: {
                    spoersmaal: t('inntektenDin.naeringsinntekt.norgeEllerUtland'),
                    svar: inntektenDin.naeringsinntekt!.norgeEllerUtland!.map((norgeEllerUtland) => ({
                        verdi: konverterNorgeEllerUtland(norgeEllerUtland),
                        innhold: t(norgeEllerUtland),
                    })),
                },
                norge: inntektenDin.naeringsinntekt!.norgeEllerUtland.includes(NorgeOgUtland.norge)
                    ? {
                          jevntOpptjentNaeringsinntekt: {
                              svar: {
                                  spoersmaal: t('inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.svar'),
                                  svar: valgTilSvar(
                                      t,
                                      inntektenDin.naeringsinntekt!.norge!.jevntOpptjentNaeringsinntekt!.svar!
                                  ),
                              },
                              beskrivelse:
                                  inntektenDin.naeringsinntekt!.norge!.jevntOpptjentNaeringsinntekt!.svar === IValg.NEI
                                      ? {
                                            spoersmaal: t(
                                                'inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.beskrivelse'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.naeringsinntekt!.norge!.jevntOpptjentNaeringsinntekt!
                                                        .beskrivelse!,
                                            },
                                        }
                                      : undefined,
                          },
                          inntektIFjor: doedsfallIAar
                              ? {
                                    aarsinntekt: foedt1963EllerTidligere
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.naeringsinntekt!.norge!.inntektIFjor!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    tilDoedsfall: erIkkeDesember
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.naeringsinntekt.norge.inntektIFjor.tilDoedsfall'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.naeringsinntekt!.norge!.inntektIFjor!.tilDoedsfall!,
                                              },
                                          }
                                        : undefined,
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.norge!.inntektIFjor!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektIAar: doedsfallIAar
                              ? {
                                    tilDoedsfall: {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.norge.inntektIAar.tilDoedsfall'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.norge!.inntektIAar!.tilDoedsfall!,
                                        },
                                    },
                                    aarsinntekt: erIkkeDesember
                                        ? {
                                              spoersmaal: t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt'),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.naeringsinntekt!.norge!.inntektIAar!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.norge!.inntektIAar!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektNesteAar:
                              doedsfallIAar && erMellomOktoberogDesember()
                                  ? {
                                        aarsinntekt: {
                                            spoersmaal: t(
                                                'inntektenDin.naeringsinntekt.norge.inntektNesteAar.aarsinntekt'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.naeringsinntekt!.norge!.inntektNesteAar!.aarsinntekt!,
                                            },
                                        },
                                    }
                                  : undefined,
                      }
                    : undefined,
                utland: inntektenDin.naeringsinntekt!.norgeEllerUtland.includes(NorgeOgUtland.utland)
                    ? {
                          jevntOpptjentNaeringsinntekt: {
                              svar: {
                                  spoersmaal: t('inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.svar'),
                                  svar: valgTilSvar(
                                      t,
                                      inntektenDin.naeringsinntekt!.utland!.jevntOpptjentNaeringsinntekt!.svar!
                                  ),
                              },
                              beskrivelse:
                                  inntektenDin.naeringsinntekt!.utland!.jevntOpptjentNaeringsinntekt!.svar === IValg.NEI
                                      ? {
                                            spoersmaal: t(
                                                'inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.beskrivelse'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.naeringsinntekt!.utland!.jevntOpptjentNaeringsinntekt!
                                                        .beskrivelse!,
                                            },
                                        }
                                      : undefined,
                          },
                          inntektAaretFoerDoedsfall:
                              !doedsfallIAar && foedt1963EllerTidligere
                                  ? {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.inntektAaretFoerDoedsfall'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.utland!.inntektAaretFoerDoedsfall!,
                                        },
                                    }
                                  : undefined,
                          inntektIFjor: doedsfallIAar
                              ? {
                                    aarsinntekt: foedt1963EllerTidligere
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.naeringsinntekt.utland.inntektIFjor.aarsinntekt'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.naeringsinntekt!.utland!.inntektIFjor!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    tilDoedsfall: erIkkeDesember
                                        ? {
                                              spoersmaal: t(
                                                  'inntektenDin.naeringsinntekt.utland.inntektIFjor.tilDoedsfall'
                                              ),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.naeringsinntekt!.utland!.inntektIFjor!.tilDoedsfall!,
                                              },
                                          }
                                        : undefined,
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.utland.inntektIFjor.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.utland!.inntektIFjor!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektIAar: doedsfallIAar
                              ? {
                                    tilDoedsfall: {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.utland.inntektIAar.tilDoedsfall'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.utland!.inntektIAar!.tilDoedsfall!,
                                        },
                                    },
                                    aarsinntekt: erIkkeDesember
                                        ? {
                                              spoersmaal: t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt'),
                                              svar: {
                                                  innhold:
                                                      inntektenDin.naeringsinntekt!.utland!.inntektIAar!.aarsinntekt!,
                                              },
                                          }
                                        : undefined,
                                }
                              : {
                                    aarsinntekt: {
                                        spoersmaal: t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt'),
                                        svar: {
                                            innhold: inntektenDin.naeringsinntekt!.utland!.inntektIAar!.aarsinntekt!,
                                        },
                                    },
                                },
                          inntektNesteAar:
                              doedsfallIAar && erMellomOktoberogDesember()
                                  ? {
                                        aarsinntekt: {
                                            spoersmaal: t(
                                                'inntektenDin.naeringsinntekt.utland.inntektNesteAar.aarsinntekt'
                                            ),
                                            svar: {
                                                innhold:
                                                    inntektenDin.naeringsinntekt!.utland!.inntektNesteAar!.aarsinntekt!,
                                            },
                                        },
                                    }
                                  : undefined,
                      }
                    : undefined,
                endringAvInntekt: mapEndringAvInntekt(t, inntektenDin.naeringsinntekt!.forventerEndringAvInntekt),
            },
        }
    }

    let pensjonEllerUfoere: PensjonEllerUfoere | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.pensjonEllerUfoere)) {
        pensjonEllerUfoere = {
            pensjonstype: {
                spoersmaal: t('inntektenDin.pensjonEllerUfoere.pensjonstype'),
                svar: inntektenDin.pensjonEllerUfoere!.pensjonstype!.map((ytelse) => ({
                    verdi: konverterPensjonEllerTrygd(ytelse),
                    innhold: t(ytelse),
                })),
            },
            tjenestepensjonsordning: inntektenDin.pensjonEllerUfoere!.pensjonstype!.includes(
                PensjonEllerTrygd.tjenestepensjonsordning
            )
                ? {
                      type: {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type'),
                          svar: inntektenDin.pensjonEllerUfoere!.tjenestepensjonsordning!.type.map((ytelse) => ({
                              verdi: konverterPensjonsYtelse(ytelse),
                              innhold: t(ytelse),
                          })),
                      },
                      afpOffentlig:
                          inntektenDin.pensjonEllerUfoere!.tjenestepensjonsordning!.type.includes(
                              PensjonsYtelse.avtalefestetPensjonOffentlig
                          ) && skalViseAFPOffentligFelter(bruker, [PensjonsYtelse.avtalefestetPensjonOffentlig])
                              ? {
                                    innvilget: {
                                        spoersmaal: t(
                                            'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.innvilget'
                                        ),
                                        svar: {
                                            innhold:
                                                inntektenDin.pensjonEllerUfoere!.tjenestepensjonsordning!.afpOffentlig!
                                                    .innvilget,
                                        },
                                    },
                                    beloep: {
                                        spoersmaal: t(
                                            'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.beloep'
                                        ),
                                        svar: {
                                            innhold:
                                                inntektenDin.pensjonEllerUfoere!.tjenestepensjonsordning!.afpOffentlig!
                                                    .beloep,
                                        },
                                    },
                                }
                              : undefined,
                      utbetaler: {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!.tjenestepensjonsordning!.utbetaler,
                          },
                      },
                  }
                : undefined,
            utland: inntektenDin.pensjonEllerUfoere!.pensjonstype!.includes(PensjonEllerTrygd.pensjonFraUtlandet)
                ? {
                      type: {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.type'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!.utland!.type!,
                          },
                      },
                      land: {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.land'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!.utland!.land!,
                          },
                      },
                      beloepMedValuta: {
                          spoersmaal: t('felles.aarligBeloep'),
                          svar: {
                              innhold: `${inntektenDin.pensjonEllerUfoere!.utland!
                                  .beloep!} ${inntektenDin.pensjonEllerUfoere!.utland!.valuta!}`,
                          },
                      },
                  }
                : undefined,
        }
    }

    let inntektViaYtelserFraNAV: InntektViaYtelserFraNAV | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.ytelser)) {
        inntektViaYtelserFraNAV = {
            ytelser: {
                spoersmaal: t('inntektenDin.inntektViaYtelserFraNAV.ytelser'),
                svar: inntektenDin.inntektViaYtelserFraNAV!.ytelser!.map((ytelse) => ({
                    verdi: konverterInntektEllerUtbetaling(ytelse),
                    innhold: t(ytelse),
                })),
            },
            aktivitetsplan: inntektenDin.inntektViaYtelserFraNAV!.ytelser!.includes(
                InntektEllerUtbetaling.arbeidsavklaringspenger
            )
                ? {
                      spoersmaal: t('inntektenDin.inntektViaYtelserFraNAV.aktivitetsplan.svar'),
                      svar: valgTilSvar(t, inntektenDin.inntektViaYtelserFraNAV!.aktivitetsplan!.svar!),
                  }
                : undefined,
        }
    }

    let ingenInntekt: IngenInntekt | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.annen)) {
        ingenInntekt = {
            svar: {
                spoersmaal: t('inntektenDin.ingenInntekt.svar'),
                svar: valgTilSvar(t, inntektenDin.ingenInntekt!.svar!),
            },
            beloep:
                inntektenDin.ingenInntekt!.svar! === IValg.JA
                    ? {
                          spoersmaal: t('inntektenDin.ingenInntekt.beloep'),
                          svar: {
                              innhold: inntektenDin.ingenInntekt!.beloep!,
                          },
                      }
                    : undefined,
            beskrivelse:
                inntektenDin.ingenInntekt!.svar! === IValg.JA
                    ? {
                          spoersmaal: t('inntektenDin.ingenInntekt.beskrivelse'),
                          svar: {
                              innhold: inntektenDin.ingenInntekt!.beskrivelse!,
                          },
                      }
                    : undefined,
        }
    }

    const ytelserNAV: YtelserNav = {
        soektOmYtelse: {
            spoersmaal: t('inntektenDin.ytelserNAV.svar'),
            svar: valgTilSvar(t, inntektenDin.ytelserNAV!.svar!),
        },
        soektYtelse:
            inntektenDin.ytelserNAV!.svar! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.soekteYtelser'),
                      svar: inntektenDin.ytelserNAV!.soekteYtelser!.map((ytelse) => ({
                          verdi: konverterSoekteYtelserNAV(ytelse),
                          innhold: t(ytelse),
                      })),
                  }
                : undefined,
    }

    const ytelserAndre: YtelserAndre = {
        soektOmYtelse: {
            spoersmaal: t('inntektenDin.ytelserAndre.svar'),
            svar: valgTilSvar(t, inntektenDin.ytelserAndre!.svar!),
        },
        soektYtelse:
            inntektenDin.ytelserAndre!.svar! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.soekteYtelser'),
                      svar: inntektenDin.ytelserAndre!.soekteYtelser!.map((ytelse) => ({
                          verdi: konverterSoekteYtelserAndre(ytelse),
                          innhold: t(ytelse),
                      })),
                  }
                : undefined,
        pensjonsordning:
            inntektenDin.ytelserAndre!.svar! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.pensjonsordning'),
                      svar: {
                          innhold: inntektenDin.ytelserAndre!.pensjonsordning!,
                      },
                  }
                : undefined,
    }

    return {
        // TODO NYE DATASTRUKTUR FOR INNTEKT
        skalGaaAvMedAlderspensjon,
        inntektFremTilDoedsfallet,
        forventetInntektIAar,
        forventetInntektTilNesteAar,
        // TODO GAMMLE DATASTRUKTUR FOR INNTEKT
        loennsinntekt,
        naeringsinntekt,
        pensjonEllerUfoere,
        inntektViaYtelserFraNAV,
        ingenInntekt,
        ytelserNAV,
        ytelserAndre,
    }
}

const mapForholdTilAvdoede = (t: TFunction, forholdTilAvdoede: IForholdAvdoede): ForholdTilAvdoede => {
    const relasjon: Opplysning<EnumSvar<ForholdTilAvdoedeType>> = {
        spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.relasjon'),
        svar: {
            verdi: konverterRelasjonAvdoed(forholdTilAvdoede.relasjon!),
            innhold: t(forholdTilAvdoede.relasjon!),
        },
    }

    const datoForInngaattPartnerskap: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForInngaattPartnerskap
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap'),
              svar: {
                  innhold: forholdTilAvdoede.datoForInngaattPartnerskap,
              },
          }
        : undefined

    const datoForSkilsmisse: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForSkilsmisse
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse'),
              svar: {
                  innhold: forholdTilAvdoede.datoForSkilsmisse,
              },
          }
        : undefined

    const samboereMedFellesBarnFoerGiftemaal: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined =
        !!forholdTilAvdoede.samboereMedFellesBarn
            ? {
                  spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn'),
                  svar: valgTilSvar(t, forholdTilAvdoede.samboereMedFellesBarn),
              }
            : undefined

    const datoForInngaattSamboerskap: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForInngaattSamboerskap
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap'),
              svar: {
                  innhold: forholdTilAvdoede.datoForInngaattSamboerskap,
              },
          }
        : undefined

    const datoForSamlivsbrudd: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForSamlivsbrudd
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd'),
              svar: {
                  innhold: forholdTilAvdoede.datoForSamlivsbrudd,
              },
          }
        : undefined

    const fellesBarn: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.fellesBarn
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn'),
              svar: valgTilSvar(t, forholdTilAvdoede.fellesBarn),
          }
        : undefined

    const tidligereGift: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.tidligereGift
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.tidligereGift'),
              svar: valgTilSvar(t, forholdTilAvdoede.tidligereGift),
          }
        : undefined

    const mottokBidrag: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined> | undefined =
        !!forholdTilAvdoede.mottokBidrag
            ? {
                  spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag'),
                  svar: valgTilSvar(t, forholdTilAvdoede.mottokBidrag.svar),
                  opplysning:
                      forholdTilAvdoede.mottokBidrag?.svar === IValg.JA
                          ? {
                                spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum'),
                                svar: {
                                    innhold: `${forholdTilAvdoede.mottokBidrag?.sum}`,
                                },
                            }
                          : undefined,
              }
            : undefined

    return {
        relasjon,
        datoForInngaattSamboerskap,
        datoForInngaattPartnerskap,
        datoForSkilsmisse,
        datoForSamlivsbrudd,
        fellesBarn,
        samboereMedFellesBarnFoerGiftemaal,
        tidligereGift,
        mottokBidrag,
    }
}

const mapSelvstendigNæringsdrivende = (
    t: TFunction,
    selvstendig: ISelvstendigNaeringsdrivende
): SelvstendigNaeringsdrivende => {
    return {
        firmanavn: {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.tittel'),
            svar: {
                innhold: selvstendig.beskrivelse!,
            },
        },
        orgnr: {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.orgnr'),
            svar: {
                innhold: selvstendig.orgnr!,
            },
        },
        arbeidsmengde: {
            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar'),
            svar: {
                innhold: `${selvstendig!.arbeidsmengde!.svar!} ${t(selvstendig!.arbeidsmengde!.type!)}`,
            },
        },
        endretArbeidssituasjon: {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.svar'),
            svar: valgTilSvar(t, selvstendig.forventerEndretArbeidssituasjon!.svar!),
            opplysning:
                selvstendig.forventerEndretArbeidssituasjon?.svar === IValg.JA
                    ? {
                          spoersmaal: t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.beskrivelse'),
                          svar: {
                              innhold: `${selvstendig.forventerEndretArbeidssituasjon?.beskrivelse}`,
                          },
                      }
                    : undefined,
        },
    }
}

const mapEndringAvInntekt = (t: TFunction, endringAvInntekt: IForventerEndringAvInntekt): EndringAvInntekt => {
    return {
        fremtidigEndringAvInntekt: {
            spoersmaal: t('inntektenDin.forventerEndringAvInntekt.svar'),
            svar: valgTilSvar(t, endringAvInntekt!.svar!),
        },
        grunn:
            endringAvInntekt!.svar! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.forventerEndringAvInntekt.grunn'),
                      svar: {
                          verdi: konverterEndringAvInntektGrunn(endringAvInntekt!.grunn!),
                          innhold: t(endringAvInntekt!.grunn!),
                      },
                  }
                : undefined,
        annenGrunn:
            endringAvInntekt!.grunn === EndringAvInntektGrunn.annenGrunn
                ? {
                      spoersmaal: t('inntektenDin.forventerEndringAvInntekt.annenGrunn'),
                      svar: {
                          innhold: endringAvInntekt!.annenGrunn!,
                      },
                  }
                : undefined,
    }
}
