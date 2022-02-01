import { TFunction } from "i18next";
import { ISoeknad } from "../../context/soknad/soknad";
import { IBruker } from "../../context/bruker/bruker";
import {
    AndreYtelser,
    AnnenUtdanning,
    ArbeidOgUtdanning,
    Arbeidstaker,
    BetingetOpplysning,
    ForholdTilAvdoede,
    ForholdTilAvdoedeType,
    HoeyesteUtdanning,
    InntektType,
    Kontaktinfo,
    OppholdUtland,
    Opplysning,
    SamboerInntekt,
    SelvstendigNaeringsdrivende,
    SivilstatusType,
    JaNeiVetIkke,
    Utdanning,
    Ytelser, EnumSvar, FritekstSvar, DatoSvar
} from "../dto/FellesOpplysninger";
import { Gjenlevende, PersonType, Samboer } from "../dto/Person";
import { valgTilSvar } from "./fellesMapper";
import { IForholdAvdoede, INySivilstatus, ISoeker, Sivilstatus } from "../../typer/person";
import { IValg } from "../../typer/Spoersmaal";
import { ISituasjon, JobbStatus } from "../../typer/situasjon";
import {
    konverterJobbStatus,
    konverterRelasjonAvdoed,
    konverterSamboerInntekt,
    konverterSivilstatus,
    konverterStillingType,
    konverterTilHoyesteUtdanning,
    konverterYtelser
} from "./typeMapper";
import { fullAdresse } from "../../utils/adresse";


export const mapGjenlevende = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Gjenlevende => {
    const kontaktinfo: Kontaktinfo = {
        telefonnummer: {
            spoersmaal: bruker.telefonnummer ? t("felles.telefonnummer") : t("omDeg.kontaktinfo.telefonnummer"),
            svar: {
                innhold: bruker.telefonnummer || soeknad.omDeg.kontaktinfo!!.telefonnummer || "-"
            }
        }
    };

    const flyktning = !!soeknad.omDeg.flyktning ? {
        spoersmaal: t("omDeg.flyktning"),
        svar: valgTilSvar(t, soeknad.omDeg.flyktning),
    } : undefined;

    const annenUtdanning: Opplysning<AnnenUtdanning> | undefined = soeknad.dinSituasjon.utdanning?.hoyesteFullfoerteUtdanning === HoeyesteUtdanning.ANNEN ? {
        spoersmaal: t("dinSituasjon.utdanning.annenUtdanning"),
        svar: {
            innhold: soeknad.dinSituasjon.utdanning!!.annenUtdanning!!
        }
    } : undefined;

    const opplysningAlternativAdresse: Opplysning<FritekstSvar> | undefined = soeknad.omDeg.bostedsadresseBekreftet === IValg.NEI ? {
        spoersmaal: t("omDeg.alternativAdresse"),
        svar: {
            innhold: soeknad.omDeg.alternativAdresse!!
        }
    } : undefined;

    // TODO: Slå sammen med ArbeidOgUtdanning ... ?
    const fullfoertUtdanning: BetingetOpplysning<EnumSvar<HoeyesteUtdanning>, Opplysning<AnnenUtdanning>> | undefined = !bruker.adressebeskyttelse ? {
        spoersmaal: t("dinSituasjon.utdanning.hoyesteFullfoerteUtdanning"),
        svar: {
            verdi: konverterTilHoyesteUtdanning(soeknad.dinSituasjon.utdanning!!.hoyesteFullfoerteUtdanning!!),
            innhold: t(soeknad.dinSituasjon.utdanning!!.hoyesteFullfoerteUtdanning!!)
        },
        opplysning: annenUtdanning
    } : undefined;

    return {
        type: PersonType.GJENLEVENDE,

        fornavn: {
            spoersmaal: t("felles.fornavn"),
            svar: bruker.fornavn!!
        },
        etternavn: {
            spoersmaal: t("felles.etternavn"),
            svar: bruker.etternavn!!
        },
        foedselsnummer: {
            spoersmaal: t("felles.foedselsnummer"),
            svar: bruker.foedselsnummer!!
        },

        statsborgerskap: {
            spoersmaal: t("felles.statsborgerskap"),
            svar: `${bruker.statsborgerskap}`
        },
        sivilstatus: {
            spoersmaal: t("felles.sivilstatus"),
            svar: `${bruker.sivilstatus}`
        },

        adresse: !bruker.adressebeskyttelse ? {
            spoersmaal: t("felles.adresse"),
            svar: fullAdresse(bruker)
        } : undefined,
        bostedsAdresse: !bruker.adressebeskyttelse ? {
            spoersmaal: t("omDeg.bostedsadresseBekreftet"),
            svar: valgTilSvar(t, soeknad.omDeg.bostedsadresseBekreftet!!),
            opplysning: opplysningAlternativAdresse
        } : undefined,
        kontaktinfo,
        flyktning,
        oppholdUtland: !bruker.adressebeskyttelse ? hentOppholdUtland(t, soeknad.omDeg) : undefined,
        nySivilstatus: hentSivilstatus(t, soeknad.omDegOgAvdoed.nySivilstatus!!),
        arbeidOgUtdanning: !bruker.adressebeskyttelse ? hentArbeidOgUtdanning(t, soeknad.dinSituasjon) : undefined,
        fullfoertUtdanning,
        andreYtelser: hentAndreYtelser(t, soeknad.dinSituasjon),
        uregistrertEllerVenterBarn: {
            spoersmaal: t("omBarn.gravidEllerNyligFoedt"),
            svar: valgTilSvar(t, soeknad.opplysningerOmBarn.gravidEllerNyligFoedt!!)
        },
        forholdTilAvdoede: mapForholdTilAvdoede(t, soeknad.omDegOgAvdoed.forholdTilAvdoede!!)
    }
};

const hentOppholdUtland = (t: TFunction, omDeg: ISoeker): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland> => {
    let opplysning: OppholdUtland | undefined;

    if (omDeg.oppholderSegINorge === IValg.NEI) {
        opplysning = {
            land: {
                spoersmaal: t("omDeg.oppholdsland"),
                svar: {
                    innhold: omDeg.oppholdsland!!
                }
            },
            medlemFolketrygd: {
                spoersmaal: t("omDeg.medlemFolketrygdenUtland"),
                svar: valgTilSvar(t, omDeg.medlemFolketrygdenUtland!!),
            }
        };
    }

    return {
        spoersmaal: t("omDeg.oppholderSegINorge"),
        svar: valgTilSvar(t, omDeg.oppholderSegINorge!!),
        opplysning
    }
}

const hentSivilstatus = (t: TFunction, nySivilstatus: INySivilstatus): BetingetOpplysning<EnumSvar<SivilstatusType>, Samboer> => {
    let opplysning: Samboer | undefined;

    if (nySivilstatus?.sivilstatus == Sivilstatus.samboerskap) {
        const samboer = nySivilstatus.samboerskap!!.samboer!!;
        let inntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, SamboerInntekt> | undefined;

        if (samboer.harInntekt?.svar === IValg.JA) {
            const inntektTypeSvar: EnumSvar<InntektType>[] = samboer.harInntekt?.inntektstype
                ?.map(type => ({
                    verdi: konverterSamboerInntekt(type),
                    innhold: t(type)
                })) || [];

            inntekt = {
                spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar"),
                svar: valgTilSvar(t, samboer.harInntekt.svar), // TODO: Fikse type,
                opplysning: {
                    inntektstype: {
                        spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype"),
                        svar: inntektTypeSvar
                    },
                    samletBruttoinntektPrAar: {
                        spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"),
                        svar: {
                            innhold: samboer.harInntekt!!.samletBruttoinntektPrAar!!
                        }
                    }
                }
            }
        } else if (samboer.harInntekt?.svar === IValg.NEI) {
            inntekt = {
                spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar"),
                svar: valgTilSvar(t, samboer.harInntekt!!.svar!!), // TODO: Fikse type,
            };
        }

        opplysning = {
            type: PersonType.SAMBOER,
            fornavn: {
                spoersmaal: t("felles.fornavn"),
                svar: samboer.fornavn!!
            },
            etternavn: {
                spoersmaal: t("felles.etternavn"),
                svar: samboer.etternavn!!
            },
            foedselsnummer: {
                spoersmaal: t("felles.foedselsnummer"),
                svar: samboer.foedselsnummer!!
            },
            fellesBarnEllertidligereGift: {
                spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift"),
                svar: valgTilSvar(t, nySivilstatus.samboerskap!!.hattBarnEllerVaertGift!!), // TODO: Korrigere type
            },
            inntekt
        }
    }

    return {
        spoersmaal: t("omDegOgAvdoed.nySivilstatus.sivilstatus"),
        svar: {
            verdi: konverterSivilstatus(nySivilstatus!!.sivilstatus!!),
            innhold: t(nySivilstatus!!.sivilstatus!!)
        },
        opplysning
    }
}

const hentArbeidOgUtdanning = (t: TFunction, dinSituasjon: ISituasjon): ArbeidOgUtdanning => {
    let arbeidsforhold: Opplysning<Arbeidstaker[]> | undefined;

    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidstaker)) {
        arbeidsforhold = {
            spoersmaal: t("dinSituasjon.arbeidsforhold.tittel"),
            svar: dinSituasjon.arbeidsforhold?.map(arbeid => {
                const arbeidstaker: Arbeidstaker = {
                    arbeidsgiver: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.arbeidsgiver"),
                        svar: {
                            innhold: arbeid.arbeidsgiver!!
                        }
                    },
                    ansettelsesforhold: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.ansettelsesforhold"),
                        svar: {
                            verdi: konverterStillingType(arbeid.ansettelsesforhold!!),
                            innhold: t(arbeid.ansettelsesforhold!!)
                        }
                    },
                    stillingsprosent: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.stillingsprosent"),
                        svar: {
                            innhold: `${arbeid.stillingsprosent}`
                        }
                    },
                    endretInntekt: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar"),
                        svar: valgTilSvar(t, arbeid.forventerEndretInntekt!!.svar!!), // TODO: fikse type,
                        opplysning: arbeid.forventerEndretInntekt?.svar === IValg.JA ? {
                            spoersmaal: t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse"),
                            svar: {
                                innhold: `${arbeid.forventerEndretInntekt?.beskrivelse}`
                            }
                        } : undefined
                    }
                }

                return arbeidstaker;
            }) || []
        }
    }

    let annet: Opplysning<FritekstSvar> | undefined;
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.ingen)) {
        annet = {
            spoersmaal: t("dinSituasjon.ingenJobbBeskrivelse"),
            svar: {
                innhold: t(dinSituasjon.ingenJobbBeskrivelse!!)
            }
        }
    }

    let selvstendig: Opplysning<SelvstendigNaeringsdrivende[]> | undefined;
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendig)) {
        const naeringListe: SelvstendigNaeringsdrivende[] = dinSituasjon.selvstendig?.map(naering => {
            return {
                firmanavn: {
                    spoersmaal: t("dinSituasjon.selvstendig.tittel"),
                    svar: {
                        innhold: naering.beskrivelse!!
                    }
                },
                orgnr: {
                    spoersmaal: t("dinSituasjon.selvstendig.orgnr"),
                    svar: {
                        innhold: naering.orgnr!!
                    }
                },
                endretInntekt: {
                    spoersmaal: t("dinSituasjon.selvstendig.forventerEndretInntekt.svar"),
                    svar: valgTilSvar(t, naering.forventerEndretInntekt!!.svar!!), // TODO: Fikse type
                    opplysning: naering.forventerEndretInntekt?.svar === IValg.JA ? {
                        spoersmaal: t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse"),
                        svar: {
                            innhold: `${naering.forventerEndretInntekt?.beskrivelse}`
                        }
                    } : undefined
                }
            }
        }) || []

        selvstendig = {
            spoersmaal: t("dinSituasjon.selvstendig.tittel"),
            svar: naeringListe
        };
    }

    let utdanning: Opplysning<Utdanning> | undefined;
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.underUtdanning)) {
        utdanning = {
            spoersmaal: t("dinSituasjon.utdanning.naavaerendeUtdanning.tittel"),
            svar: {
                navn: {
                    spoersmaal: t("dinSituasjon.utdanning.naavaerendeUtdanning.navn"),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.navn!!
                    }
                },
                startDato: {
                    spoersmaal: t("dinSituasjon.utdanning.naavaerendeUtdanning.startDato"),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.startDato!!
                    }
                },
                sluttDato: {
                    spoersmaal: t("dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato"),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.sluttDato!!
                    }
                },
            }
        }
    }

    return {
        dinSituasjon: {
            spoersmaal: t("dinSituasjon.jobbStatus"),
            svar: dinSituasjon.jobbStatus?.map(type => ({
                verdi: konverterJobbStatus(type),
                innhold: t(type)
            })) || []
        },
        arbeidsforhold,
        selvstendig,
        utdanning,
        annet
    }
}

const hentAndreYtelser = (t: TFunction, dinSituasjon: ISituasjon): AndreYtelser => {
    const opplysningAnnetKrav: Opplysning<EnumSvar<Ytelser>> | undefined = dinSituasjon.andreYtelser?.kravOmAnnenStonad?.svar === IValg.JA ? {
        spoersmaal: t("dinSituasjon.andreYtelser.kravOmAnnenStonad.ytelser"),
        svar: {
            verdi: konverterYtelser(dinSituasjon.andreYtelser!!.kravOmAnnenStonad!!.ytelser!!),
            innhold: t(dinSituasjon.andreYtelser!!.kravOmAnnenStonad!!.ytelser!!)
        }
    } : undefined;

    return {
        kravOmAnnenStonad: {
            spoersmaal: t("dinSituasjon.andreYtelser.kravOmAnnenStonad.svar"),
            svar: valgTilSvar(t, dinSituasjon.andreYtelser!!.kravOmAnnenStonad!!.svar!!), // TODO: fikse type
            opplysning: opplysningAnnetKrav
        },
        annenPensjon: {
            spoersmaal: t("dinSituasjon.andreYtelser.annenPensjon.svar"),
            svar: valgTilSvar(t, dinSituasjon.andreYtelser!!.annenPensjon!!.svar!!), // TODO: fikse type
            opplysning: dinSituasjon.andreYtelser?.annenPensjon?.svar === IValg.JA ? {
                spoersmaal: t("dinSituasjon.andreYtelser.annenPensjon.beskrivelse"),
                svar: {
                    innhold: `${dinSituasjon.andreYtelser?.annenPensjon?.beskrivelse}`
                }
            } : undefined
        },
        pensjonUtland: {
            spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.svar"),
            svar: valgTilSvar(t, dinSituasjon.andreYtelser!!.mottarPensjonUtland!!.svar!!), // TODO: fikse type
            opplysning: dinSituasjon.andreYtelser?.mottarPensjonUtland?.svar === IValg.JA ? {
                pensjonsType: {
                    spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"),
                    svar: {
                        innhold: `${dinSituasjon.andreYtelser?.mottarPensjonUtland?.hvaSlagsPensjon}`
                    }
                },
                land: {
                    spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand"),
                    svar: {
                        innhold: `${dinSituasjon.andreYtelser?.mottarPensjonUtland?.fraHvilketLand}`
                    }
                },
                bruttobeloepPrAar: {
                    spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"),
                    svar: {
                        innhold: `${dinSituasjon.andreYtelser?.mottarPensjonUtland?.bruttobeloepPrAar}`
                    }
                }
            } : undefined
        }
    }
}

const mapForholdTilAvdoede = (t: TFunction, forholdTilAvdoede: IForholdAvdoede): ForholdTilAvdoede => {
    const relasjon: Opplysning<EnumSvar<ForholdTilAvdoedeType>> = {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.relasjon"),
        svar: {
            verdi: konverterRelasjonAvdoed(forholdTilAvdoede.relasjon!!),
            innhold: t(forholdTilAvdoede.relasjon!!)
        }
    };

    const datoForInngaattPartnerskap: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForInngaattPartnerskap ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap"),
        svar: {
            innhold: forholdTilAvdoede.datoForInngaattPartnerskap
        }
    } : undefined;

    const datoForSkilsmisse: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForSkilsmisse ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse"),
        svar: {
            innhold: forholdTilAvdoede.datoForSkilsmisse
        }
    } : undefined;

    const samboereMedFellesBarnFoerGiftemaal: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.samboereMedFellesBarn ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn"),
        svar: valgTilSvar(t, forholdTilAvdoede.samboereMedFellesBarn)
    } : undefined;

    const mottokEktefelleBidrag: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.mottokEktefelleBidrag ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag"),
        svar: valgTilSvar(t, forholdTilAvdoede.mottokEktefelleBidrag)
    } : undefined;

    const datoForInngaattSamboerskap: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForInngaattSamboerskap ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap"),
        svar: {
            innhold: forholdTilAvdoede.datoForInngaattSamboerskap
        }
    } : undefined;

    const datoForSamlivsbrudd: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForSamlivsbrudd ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd"),
        svar: {
            innhold: forholdTilAvdoede.datoForSamlivsbrudd
        }
    } : undefined;

    const fellesBarn: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.fellesBarn ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn"),
        svar: valgTilSvar(t, forholdTilAvdoede.fellesBarn)
    } : undefined;

    const tidligereGift: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.tidligereGift ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.tidligereGift"),
        svar: valgTilSvar(t, forholdTilAvdoede.tidligereGift)
    } : undefined;

    const omsorgForBarn: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.omsorgForBarn ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn"),
        svar: valgTilSvar(t, forholdTilAvdoede.omsorgForBarn)
    } : undefined;

    const mottokBidrag: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.mottokBidrag ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.mottokBidrag"),
        svar: valgTilSvar(t, forholdTilAvdoede.mottokBidrag)
    } : undefined;

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
        mottokBidrag
    }
};
