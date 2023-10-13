import { TFunction } from 'i18next'
import { ISoeknad } from '../../context/soknad/soknad'
import { IBruker } from '../../context/bruker/bruker'
import {
    AnnenInntekt,
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
    HoeyesteUtdanning,
    InntektOgPensjon,
    InntektType,
    JaNeiVetIkke,
    Kontaktinfo,
    Loennsinntekt,
    NaeringsinntektGjenlevende,
    OppholdUtland,
    Opplysning,
    PensjonEllerUfoere,
    SamboerInntekt,
    SelvstendigNaeringsdrivende,
    SivilstatusType,
    Stoenader,
    TilbudOmJobb,
    Utdanning,
    YtelserAndre,
    YtelserNav,
} from '../dto/FellesOpplysninger'
import { Gjenlevende, PersonType, Samboer } from '../dto/Person'
import { valgTilSvar } from './fellesMapper'
import { IForholdAvdoede, INySivilstatus, ISoeker, Sivilstatus } from '../../typer/person'
import { IValg } from '../../typer/Spoersmaal'
import { ISituasjon, JobbStatus } from '../../typer/situasjon'
import {
    konverterArbeidsmengde,
    konverterEndringAvInntektGrunn,
    konverterIngenJobb,
    konverterInntektEllerUtbetaling,
    konverterJobbStatus,
    konverterPensjonsYtelse,
    konverterRelasjonAvdoed,
    konverterSagtOppEllerRedusert,
    konverterSamboerInntekt,
    konverterSivilstatus,
    konverterSoekteYtelserAndre,
    konverterSoekteYtelserNAV,
    konverterStillingType,
    konverterStudieform,
    konverterTilHoyesteUtdanning,
} from './typeMapper'
import { fullAdresse } from '../../utils/adresse'
import { Arbeidsmengde, IngenJobb, ISelvstendigNaeringsdrivende, StillingType } from '../../typer/arbeidsforhold'
import {
    EndringAvInntektGrunn,
    IForventerEndringAvInntekt,
    IInntekt,
    InntektEllerUtbetaling,
    InntektsTyper,
    PensjonsYtelse,
} from '../../typer/inntekt'

export const mapGjenlevende = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Gjenlevende => {
    const kontaktinfo: Kontaktinfo = {
        telefonnummer: {
            spoersmaal: bruker.telefonnummer ? t('felles.telefonnummer') : t('omDeg.kontaktinfo.telefonnummer'),
            svar: {
                innhold: bruker.telefonnummer || soeknad.omDeg.kontaktinfo!!.telefonnummer || '-',
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
              spoersmaal: t('dinSituasjon.utdanning.hoyesteFullfoerteUtdanning'),
              svar:
                  soeknad.dinSituasjon.utdanning!!.hoyesteFullfoerteUtdanning!!.map((type) => ({
                      verdi: konverterTilHoyesteUtdanning(type),
                      innhold: t(type),
                  })) || [],
          }
        : undefined

    return {
        type: PersonType.GJENLEVENDE,

        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: bruker.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: bruker.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: bruker.foedselsnummer!!,
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
                          innhold: soeknad.omDeg.alternativAdresse!!,
                      },
                  }
                : undefined,
        kontaktinfo,
        flyktning,
        oppholdUtland: !bruker.adressebeskyttelse ? hentOppholdUtland(t, soeknad.omDeg) : undefined,
        nySivilstatus: hentSivilstatus(t, soeknad.omDegOgAvdoed.nySivilstatus!!),
        arbeidOgUtdanning: !bruker.adressebeskyttelse ? hentArbeidOgUtdanning(t, soeknad.dinSituasjon) : undefined,
        fullfoertUtdanning,
        inntektOgPensjon: hentInntektOgPensjon(t, soeknad.inntektenDin),
        uregistrertEllerVenterBarn: {
            spoersmaal: t('omBarn.gravidEllerNyligFoedt'),
            svar: valgTilSvar(t, soeknad.opplysningerOmBarn.gravidEllerNyligFoedt!!),
        },
        forholdTilAvdoede: mapForholdTilAvdoede(t, soeknad.omDegOgAvdoed.forholdTilAvdoede!!),
    }
}

export const mapStoenader = (t: TFunction, soeknad: ISoeknad): Opplysning<EnumSvar<Stoenader>>[] => {
    const stoenader: Opplysning<EnumSvar<Stoenader>>[] = []

    if (soeknad.dinSituasjon.utdanning?.soeknadOmSkolepenger) {
        stoenader.push({
            spoersmaal: t('dinSituasjon.utdanning.soeknadOmSkolepenger'),
            svar: {
                innhold: t('dinSituasjon.utdanning.soeknadOmSkolepenger.bekreftelse'),
                verdi: Stoenader.SKOLEPENGER,
            },
        })
    }

    if (soeknad.dinSituasjon.utdanning?.soeknadOmTilleggsstoenadUtdanning) {
        stoenader.push({
            spoersmaal: t('dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning'),
            svar: {
                innhold: t('dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse'),
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

const hentOppholdUtland = (t: TFunction, omDeg: ISoeker): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland> => {
    let opplysning: OppholdUtland | undefined

    if (omDeg.oppholderSegINorge === IValg.NEI) {
        opplysning = {
            land: {
                spoersmaal: t('omDeg.oppholdsland'),
                svar: {
                    innhold: omDeg.oppholdsland!!,
                },
            },
        }
    }

    return {
        spoersmaal: t('omDeg.oppholderSegINorge'),
        svar: valgTilSvar(t, omDeg.oppholderSegINorge!!),
        opplysning,
    }
}

const hentSivilstatus = (
    t: TFunction,
    nySivilstatus: INySivilstatus
): BetingetOpplysning<EnumSvar<SivilstatusType>, Samboer> => {
    let opplysning: Samboer | undefined

    if (nySivilstatus?.sivilstatus == Sivilstatus.samboerskap) {
        const samboer = nySivilstatus.samboerskap!!.samboer!!
        let inntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, SamboerInntekt> | undefined

        if (samboer.harInntekt?.svar === IValg.JA) {
            const inntektTypeSvar: EnumSvar<InntektType>[] =
                samboer.harInntekt?.inntektstype?.map((type) => ({
                    verdi: konverterSamboerInntekt(type),
                    innhold: t(type),
                })) || []

            inntekt = {
                spoersmaal: t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar'),
                svar: valgTilSvar(t, samboer.harInntekt.svar), // TODO: Fikse type,
                opplysning: {
                    inntektstype: {
                        spoersmaal: t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype'),
                        svar: inntektTypeSvar,
                    },
                    samletBruttoinntektPrAar: {
                        spoersmaal: t(
                            'omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar'
                        ),
                        svar: {
                            innhold: samboer.harInntekt!!.samletBruttoinntektPrAar!!,
                        },
                    },
                },
            }
        } else if (samboer.harInntekt?.svar === IValg.NEI) {
            inntekt = {
                spoersmaal: t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar'),
                svar: valgTilSvar(t, samboer.harInntekt!!.svar!!), // TODO: Fikse type,
            }
        }

        opplysning = {
            type: PersonType.SAMBOER,
            fornavn: {
                spoersmaal: t('felles.fornavn'),
                svar: samboer.fornavn!!,
            },
            etternavn: {
                spoersmaal: t('felles.etternavn'),
                svar: samboer.etternavn!!,
            },
            foedselsnummer: {
                spoersmaal: t('felles.foedselsnummer'),
                svar: samboer.foedselsnummer!!,
            },
            fellesBarnEllertidligereGift: {
                spoersmaal: t('omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift'),
                svar: valgTilSvar(t, nySivilstatus.samboerskap!!.hattBarnEllerVaertGift!!), // TODO: Korrigere type
            },
            inntekt,
        }
    }

    return {
        spoersmaal: t('omDegOgAvdoed.nySivilstatus.sivilstatus'),
        svar: {
            verdi: konverterSivilstatus(nySivilstatus!!.sivilstatus!!),
            innhold: t(nySivilstatus!!.sivilstatus!!),
        },
        opplysning,
    }
}

const hentArbeidOgUtdanning = (t: TFunction, dinSituasjon: ISituasjon): ArbeidOgUtdanning => {
    let arbeidsforhold: Opplysning<Arbeidstaker[]> | undefined

    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidstaker)) {
        arbeidsforhold = {
            spoersmaal: t('dinSituasjon.arbeidsforhold.tittel'),
            svar:
                dinSituasjon.arbeidsforhold?.map((arbeid) => {
                    const arbeidstaker: Arbeidstaker = {
                        arbeidsgiver: {
                            spoersmaal: t('dinSituasjon.arbeidsforhold.arbeidsgiver'),
                            svar: {
                                innhold: arbeid.arbeidsgiver!!,
                            },
                        },
                        typeArbeidsmengde: {
                            spoersmaal: t('dinSituasjon.arbeidsforhold.typeArbeidsmengde'),
                            svar: {
                                verdi: konverterArbeidsmengde(arbeid.typeArbeidsmengde!!),
                                innhold: t(arbeid.typeArbeidsmengde!!),
                            },
                        },
                        arbeidsmengde:
                            arbeid.typeArbeidsmengde!! === Arbeidsmengde.timer
                                ? {
                                      spoersmaal: t('dinSituasjon.selvstendig.arbeidsmengde.timer'),
                                      svar: {
                                          innhold: arbeid!!.arbeidsmengde!!.timer!!,
                                      },
                                  }
                                : {
                                      spoersmaal: t('dinSituasjon.selvstendig.arbeidsmengde.prosent'),
                                      svar: {
                                          innhold: arbeid!!.arbeidsmengde!!.prosent!!,
                                      },
                                  },
                        ansettelsesforhold: {
                            spoersmaal: t('dinSituasjon.arbeidsforhold.ansettelsesforhold'),
                            svar: {
                                verdi: konverterStillingType(arbeid.ansettelsesforhold!!),
                                innhold: t(arbeid.ansettelsesforhold!!),
                            },
                        },
                        harSluttdato:
                            arbeid?.ansettelsesforhold === StillingType.midlertidig
                                ? {
                                      spoersmaal: t('dinSituasjon.arbeidsforhold.midlertidig.svar'),
                                      svar: valgTilSvar(t, arbeid!!.midlertidig!!.svar!!),
                                  }
                                : undefined,
                        sluttdato:
                            arbeid?.midlertidig?.svar === IValg.JA
                                ? {
                                      spoersmaal: t('dinSituasjon.arbeidsforhold.midlertidig.sluttdatoVelger'),
                                      svar: {
                                          innhold: arbeid!!.midlertidig!!.sluttdatoVelger!!,
                                      },
                                  }
                                : undefined,
                        endretArbeidssituasjon: {
                            spoersmaal: t('dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.svar'),
                            svar: valgTilSvar(t, arbeid.forventerEndretArbeidssituasjon!!.svar!!), // TODO: fikse type,
                            opplysning:
                                arbeid.forventerEndretArbeidssituasjon?.svar === IValg.JA
                                    ? {
                                          spoersmaal: t(
                                              'dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse'
                                          ),
                                          svar: {
                                              innhold: t(arbeid.forventerEndretArbeidssituasjon.beskrivelse!!),
                                          },
                                      }
                                    : undefined,
                        },
                        sagtOppEllerRedusert: {
                            spoersmaal: t('dinSituasjon.arbeidsforhold.sagtOppEllerRedusert.svar'),
                            svar: {
                                verdi: konverterSagtOppEllerRedusert(arbeid.sagtOppEllerRedusert!!.svar!!),
                                innhold: t(arbeid.sagtOppEllerRedusert!!.svar!!),
                            },
                        },
                    }

                    return arbeidstaker
                }) || [],
        }
    }

    let selvstendigENK: Opplysning<SelvstendigNaeringsdrivende[]> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendigENK)) {
        const naeringListeENK: SelvstendigNaeringsdrivende[] =
            dinSituasjon.selvstendig?.enk?.map((naering) => {
                return mapSelvstendigNæringsdrivende(t, naering)
            }) || []

        selvstendigENK = {
            spoersmaal: t('dinSituasjon.selvstendig.enk.tittel'),
            svar: naeringListeENK,
        }
    }

    let selvstendigAS: Opplysning<SelvstendigNaeringsdrivende[]> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendigAS)) {
        const naeringListeAS: SelvstendigNaeringsdrivende[] =
            dinSituasjon.selvstendig?.as?.map((naering) => {
                return mapSelvstendigNæringsdrivende(t, naering)
            }) || []

        selvstendigAS = {
            spoersmaal: t('dinSituasjon.selvstendig.as.tittel'),
            svar: naeringListeAS,
        }
    }

    let etablererVirksomhet: Opplysning<EtablererVirksomhet> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.etablerer)) {
        etablererVirksomhet = {
            spoersmaal: t('dinSituasjon.etablererVirksomhet.tittel'),
            svar: {
                virksomheten: {
                    spoersmaal: t('dinSituasjon.etablererVirksomhet.hvaHeterVirksomheten'),
                    svar: {
                        innhold: dinSituasjon.etablererVirksomhet!!.hvaHeterVirksomheten!!,
                    },
                },
                orgnr: {
                    spoersmaal: t('dinSituasjon.etablererVirksomhet.orgnr'),
                    svar: {
                        innhold: dinSituasjon.etablererVirksomhet!!.orgnr!!,
                    },
                },
                forretningsplan: {
                    spoersmaal: t('dinSituasjon.etablererVirksomhet.forretningsplan.svar'),
                    svar: valgTilSvar(t, dinSituasjon.etablererVirksomhet!!.forretningsplan!!.svar!!),
                },
                samarbeidMedNav:
                    dinSituasjon.etablererVirksomhet?.forretningsplan?.svar === IValg.JA
                        ? {
                              spoersmaal: t('dinSituasjon.etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar'),
                              svar: valgTilSvar(
                                  t,
                                  dinSituasjon!!.etablererVirksomhet!!.forretningsplan!!.samarbeidMedNAV!!.svar!!
                              ),
                          }
                        : undefined,
            },
        }
    }

    let tilbud: Opplysning<TilbudOmJobb> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.tilbud)) {
        tilbud = {
            spoersmaal: t('dinSituasjon.tilbudOmJobb.tittel'),
            svar: {
                nyttArbeidssted: {
                    spoersmaal: t('dinSituasjon.tilbudOmJobb.arbeidssted'),
                    svar: {
                        innhold: dinSituasjon.tilbudOmJobb!!.arbeidssted!!,
                    },
                },
                ansettelsesforhold: {
                    spoersmaal: t('dinSituasjon.tilbudOmJobb.ansettelsesforhold'),
                    svar: {
                        verdi: konverterStillingType(dinSituasjon.tilbudOmJobb!!.ansettelsesforhold!!),
                        innhold: t(dinSituasjon.tilbudOmJobb!!.ansettelsesforhold!!),
                    },
                },
                harSluttdato:
                    dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.midlertidig
                        ? {
                              spoersmaal: t('dinSituasjon.tilbudOmJobb.midlertidig.svar'),
                              svar: valgTilSvar(t, dinSituasjon.tilbudOmJobb!!.midlertidig!!.svar!!),
                          }
                        : undefined,
                sluttdato:
                    dinSituasjon.tilbudOmJobb?.midlertidig?.svar === IValg.JA
                        ? {
                              spoersmaal: t('dinSituasjon.tilbudOmJobb.midlertidig.sluttdatoVelger'),
                              svar: {
                                  innhold: dinSituasjon!!.tilbudOmJobb!!.midlertidig!!.sluttdatoVelger!!,
                              },
                          }
                        : undefined,
            },
        }
    }

    let arbeidssoeker: Opplysning<Arbeidssoeker> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidssoeker)) {
        arbeidssoeker = {
            spoersmaal: t('dinSituasjon.arbeidssoeker.tittel'),
            svar: {
                registrertArbeidssoeker: {
                    spoersmaal: t('dinSituasjon.arbeidssoeker.svar'),
                    svar: valgTilSvar(t, dinSituasjon.arbeidssoeker!!.svar!!),
                },
                aktivitetsplan:
                    dinSituasjon.arbeidssoeker!!.svar === IValg.JA
                        ? {
                              spoersmaal: t('dinSituasjon.arbeidssoeker.aktivitetsplan.svar'),
                              svar: valgTilSvar(t, dinSituasjon.arbeidssoeker!!.aktivitetsplan.svar!!),
                          }
                        : undefined,
            },
        }
    }

    let utdanning: Opplysning<Utdanning> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.underUtdanning)) {
        utdanning = {
            spoersmaal: t('dinSituasjon.utdanning.tittel'),
            svar: {
                studiested: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.studiested'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studiested!!,
                    },
                },
                studie: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.studie'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studie!!,
                    },
                },
                studieform: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.studieform'),
                    svar: {
                        innhold: t(dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studieform!!),
                        verdi: konverterStudieform(dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studieform!!),
                    },
                },
                studieprosent: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.studieprosent'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studieprosent!!,
                    },
                },
                startDato: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.startDato'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.startDato!!,
                    },
                },
                sluttDato: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.sluttDato!!,
                    },
                },
                godkjentUtdanning: {
                    spoersmaal: t('dinSituasjon.utdanning.naavaerendeUtdanning.godkjentUtdanning'),
                    svar: valgTilSvar(t, dinSituasjon.utdanning!!.naavaerendeUtdanning!!.godkjentUtdanning!!),
                },
            },
        }
    }

    let annenSituasjon: Opplysning<AnnenSituasjon> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.ingen)) {
        annenSituasjon = {
            spoersmaal: t('dinSituasjon.annenSituasjon.tittel'),
            svar: {
                beskrivelse: {
                    spoersmaal: t('dinSituasjon.annenSituasjon.beskrivelse'),
                    svar: {
                        innhold: t(dinSituasjon.annenSituasjon!!.beskrivelse!!),
                        verdi: konverterIngenJobb(dinSituasjon.annenSituasjon!!.beskrivelse!!),
                    },
                },
                annet:
                    dinSituasjon.annenSituasjon!!.beskrivelse === IngenJobb.annet
                        ? {
                              spoersmaal: t('dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse'),
                              svar: {
                                  innhold: `${dinSituasjon.annenSituasjon!!.annet!!.beskrivelse}`,
                              },
                          }
                        : undefined,
            },
        }
    }

    return {
        dinSituasjon: {
            spoersmaal: t('dinSituasjon.jobbStatus'),
            svar:
                dinSituasjon.jobbStatus?.map((type) => ({
                    verdi: konverterJobbStatus(type),
                    innhold: t(type),
                })) || [],
        },
        arbeidsforhold,
        selvstendigENK,
        selvstendigAS,
        etablererVirksomhet,
        tilbud,
        arbeidssoeker,
        utdanning,
        annenSituasjon,
    }
}

const hentInntektOgPensjon = (t: TFunction, inntektenDin: IInntekt): InntektOgPensjon => {
    let loennsinntekt: Opplysning<Loennsinntekt> | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.loenn)) {
        loennsinntekt = {
            spoersmaal: t('inntektenDin.loennsinntekt.tittel'),
            svar: {
                arbeidsinntektAaretFoer: {
                    spoersmaal: t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer'),
                    svar: {
                        innhold: inntektenDin.loennsinntekt!!.arbeidsinntektAaretFoer!!,
                    },
                },
                arbeidsinntektIAar: {
                    tilDoedsfall: {
                        spoersmaal: t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall'),
                        svar: {
                            innhold: inntektenDin.loennsinntekt!!.arbeidsinntektIAar!!.tilDoedsfall!!,
                        },
                    },
                    etterDoedsfall: {
                        spoersmaal: t('inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall'),
                        svar: {
                            innhold: inntektenDin.loennsinntekt!!.arbeidsinntektIAar!!.etterDoedsfall!!,
                        },
                    },
                },
            },
        }
    }

    let naeringsinntekt: Opplysning<NaeringsinntektGjenlevende> | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.naering)) {
        naeringsinntekt = {
            spoersmaal: t('inntektenDin.naeringsinntekt.tittel'),
            svar: {
                arbeidsinntektAaretFoer: {
                    spoersmaal: t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer'),
                    svar: {
                        innhold: inntektenDin.naeringsinntekt!!.arbeidsinntektAaretFoer!!,
                    },
                },
                arbeidsinntektIAar: {
                    tilDoedsfall: {
                        spoersmaal: t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall'),
                        svar: {
                            innhold: inntektenDin.naeringsinntekt!!.arbeidsinntektIAar!!.tilDoedsfall!!,
                        },
                    },
                    etterDoedsfall: {
                        spoersmaal: t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall'),
                        svar: {
                            innhold: inntektenDin.naeringsinntekt!!.arbeidsinntektIAar!!.etterDoedsfall!!,
                        },
                    },
                },
            },
        }
    }

    let pensjonEllerUfoere: PensjonEllerUfoere | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.pensjonEllerUfoere)) {
        const pensjonFraUtland = inntektenDin.pensjonEllerUfoere!!.utland!!.svar === IValg.JA

        pensjonEllerUfoere = {
            pensjonstype: {
                spoersmaal: t('inntektenDin.pensjonEllerUfoere.pensjonstype'),
                svar: inntektenDin.pensjonEllerUfoere!!.pensjonstype!!.map((ytelse) => ({
                    verdi: konverterPensjonsYtelse(ytelse),
                    innhold: t(ytelse),
                })),
            },
            pensjonsUtbetaler: inntektenDin.pensjonEllerUfoere!!.pensjonstype!!.includes(
                PensjonsYtelse.tjenestepensjonsordning
            )
                ? {
                      spoersmaal: t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler'),
                      svar: {
                          innhold: inntektenDin.pensjonEllerUfoere!!.pensjonsUtbetaler!!,
                      },
                  }
                : undefined,
            utland: {
                svar: {
                    spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.svar'),
                    svar: valgTilSvar(t, inntektenDin.pensjonEllerUfoere!!.utland!!.svar),
                },
                type: pensjonFraUtland
                    ? {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.type'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!!.utland!!.type!!,
                          },
                      }
                    : undefined,
                land: pensjonFraUtland
                    ? {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.land'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!!.utland!!.land!!,
                          },
                      }
                    : undefined,
                beloepMedValuta: pensjonFraUtland
                    ? {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.beloep'),
                          svar: {
                              innhold: `${inntektenDin.pensjonEllerUfoere!!.utland!!
                                  .beloep!!} ${inntektenDin.pensjonEllerUfoere!!.utland!!.valuta!!}`,
                          },
                      }
                    : undefined,
            },
        }
    }

    let annenInntekt: AnnenInntekt | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.annen)) {
        annenInntekt = {
            annenInntektEllerUtbetaling: {
                spoersmaal: t('inntektenDin.annenInntekt.inntektEllerUtbetaling'),
                svar: inntektenDin.annenInntekt!!.inntektEllerUtbetaling!!.map((ytelse) => ({
                    verdi: konverterInntektEllerUtbetaling(ytelse),
                    innhold: t(ytelse),
                })),
            },
            beloep: inntektenDin.annenInntekt!!.inntektEllerUtbetaling!!.includes(InntektEllerUtbetaling.annen)
                ? {
                      spoersmaal: t('inntektenDin.annenInntekt.beloep'),
                      svar: {
                          innhold: inntektenDin.annenInntekt!!.beloep!!,
                      },
                  }
                : undefined,
            endringAvInntekt: mapEndringAvInntekt(t, inntektenDin.annenInntekt!!.forventerEndringAvInntekt),
        }
    }

    const ytelserNAV: YtelserNav = {
        soektOmYtelse: {
            spoersmaal: t('inntektenDin.ytelserNAV.svar'),
            svar: valgTilSvar(t, inntektenDin.ytelserNAV!!.svar!!),
        },
        soektYtelse:
            inntektenDin.ytelserNAV!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.soekteYtelser'),
                      svar: inntektenDin.ytelserNAV!!.soekteYtelser!!.map((ytelse) => ({
                          verdi: konverterSoekteYtelserNAV(ytelse),
                          innhold: t(ytelse),
                      })),
                  }
                : undefined,
    }

    const ytelserAndre: YtelserAndre = {
        soektOmYtelse: {
            spoersmaal: t('inntektenDin.ytelserAndre.svar'),
            svar: valgTilSvar(t, inntektenDin.ytelserAndre!!.svar!!),
        },
        soektYtelse:
            inntektenDin.ytelserAndre!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.soekteYtelser'),
                      svar: inntektenDin.ytelserAndre!!.soekteYtelser!!.map((ytelse) => ({
                          verdi: konverterSoekteYtelserAndre(ytelse),
                          innhold: t(ytelse),
                      })),
                  }
                : undefined,
        pensjonsordning:
            inntektenDin.ytelserAndre!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.pensjonsordning'),
                      svar: {
                          innhold: inntektenDin.ytelserAndre!!.pensjonsordning!!,
                      },
                  }
                : undefined,
    }

    return {
        loennsinntekt,
        naeringsinntekt,
        pensjonEllerUfoere,
        annenInntekt,
        ytelserNAV,
        ytelserAndre,
    }
}

const mapForholdTilAvdoede = (t: TFunction, forholdTilAvdoede: IForholdAvdoede): ForholdTilAvdoede => {
    const relasjon: Opplysning<EnumSvar<ForholdTilAvdoedeType>> = {
        spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.relasjon'),
        svar: {
            verdi: konverterRelasjonAvdoed(forholdTilAvdoede.relasjon!!),
            innhold: t(forholdTilAvdoede.relasjon!!),
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

    const mottokEktefelleBidrag: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined =
        !!forholdTilAvdoede.mottokEktefelleBidrag
            ? {
                  spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag'),
                  svar: valgTilSvar(t, forholdTilAvdoede.mottokEktefelleBidrag),
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

    const omsorgForBarn: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.omsorgForBarn
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn'),
              svar: valgTilSvar(t, forholdTilAvdoede.omsorgForBarn),
          }
        : undefined

    const mottokBidrag: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.mottokBidrag
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag'),
              svar: valgTilSvar(t, forholdTilAvdoede.mottokBidrag),
          }
        : undefined

    return {
        relasjon,
        datoForInngaattSamboerskap,
        datoForInngaattPartnerskap,
        datoForSkilsmisse,
        mottokEktefelleBidrag,
        datoForSamlivsbrudd,
        fellesBarn,
        samboereMedFellesBarnFoerGiftemaal,
        tidligereGift,
        omsorgForBarn,
        mottokBidrag,
    }
}

const mapSelvstendigNæringsdrivende = (
    t: TFunction,
    selvstendig: ISelvstendigNaeringsdrivende
): SelvstendigNaeringsdrivende => {
    return {
        firmanavn: {
            spoersmaal: t('dinSituasjon.selvstendig.tittel'),
            svar: {
                innhold: selvstendig.beskrivelse!!,
            },
        },
        orgnr: {
            spoersmaal: t('dinSituasjon.selvstendig.orgnr'),
            svar: {
                innhold: selvstendig.orgnr!!,
            },
        },
        typeArbeidsmengde: {
            spoersmaal: t('dinSituasjon.selvstendig.arbeidsmengde.fyllUt'),
            svar: {
                verdi: konverterArbeidsmengde(selvstendig.typeArbeidsmengde!!),
                innhold: t(selvstendig.typeArbeidsmengde!!),
            },
        },
        arbeidsmengde:
            selvstendig.typeArbeidsmengde!! === Arbeidsmengde.timer
                ? {
                      spoersmaal: t('dinSituasjon.selvstendig.arbeidsmengde.timer'),
                      svar: {
                          innhold: selvstendig!!.arbeidsmengde!!.timer!!,
                      },
                  }
                : {
                      spoersmaal: t('dinSituasjon.selvstendig.arbeidsmengde.prosent'),
                      svar: {
                          innhold: selvstendig!!.arbeidsmengde!!.prosent!!,
                      },
                  },
        endretArbeidssituasjon: {
            spoersmaal: t('dinSituasjon.selvstendig.forventerEndretArbeidssituasjon.svar'),
            svar: valgTilSvar(t, selvstendig.forventerEndretArbeidssituasjon!!.svar!!), // TODO: Fikse type
            opplysning:
                selvstendig.forventerEndretArbeidssituasjon?.svar === IValg.JA
                    ? {
                          spoersmaal: t('dinSituasjon.selvstendig.forventerEndretArbeidssituasjon.beskrivelse'),
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
            svar: valgTilSvar(t, endringAvInntekt!!.svar!!),
        },
        grunn:
            endringAvInntekt!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.forventerEndringAvInntekt.grunn'),
                      svar: {
                          verdi: konverterEndringAvInntektGrunn(endringAvInntekt!!.grunn!!),
                          innhold: t(endringAvInntekt!!.grunn!!),
                      },
                  }
                : undefined,
        annenGrunn:
            endringAvInntekt!!.grunn === EndringAvInntektGrunn.annenGrunn
                ? {
                      spoersmaal: t('inntektenDin.forventerEndringAvInntekt.annenGrunn'),
                      svar: {
                          innhold: endringAvInntekt!!.annenGrunn!!,
                      },
                  }
                : undefined,
    }
}
