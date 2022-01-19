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
    Svar,
    Utdanning,
    Ytelser
} from "../dto/FellesOpplysninger";
import {
    Gjenlevende,
    PersonType,
    Samboer,
} from "../dto/Person";
import { valgTilSvar } from "./fellesMapper";
import { IForholdAvdoede, INySivilstatus, ISoeker, Sivilstatus } from "../../typer/person";
import { IValg } from "../../typer/Spoersmaal";
import { ISituasjon, JobbStatus } from "../../typer/situasjon";
import {
    konverterJobbStatus,
    konverterRelasjonAvdoed,
    konverterSamboerInntekt,
    konverterSivilstatus, konverterStillingType,
    konverterTilHoyesteUtdanning,
    konverterYtelser
} from "./typeMapper";


export const mapGjenlevende = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Gjenlevende => {
    const kontaktinfo: Kontaktinfo = {
        epost: {
            spoersmaal: t("omDeg.kontaktinfo.epost"),
            svar: soeknad.omDeg.kontaktinfo!!.epost!!
        },
        telefonnummer: {
            spoersmaal: t("omDeg.kontaktinfo.telefonnummer"),
            svar: soeknad.omDeg.kontaktinfo!!.telefonnummer
        }
    };

    const flyktning = !!soeknad.omDeg.flyktning ? {
        spoersmaal: t("omDeg.flyktning"),
        svar: valgTilSvar(soeknad.omDeg.flyktning) // TODO: Støtte riktig type
    } : undefined;

    const annenUtdanning: Opplysning<AnnenUtdanning> | undefined = soeknad.dinSituasjon.utdanning?.hoyesteFullfoerteUtdanning === HoeyesteUtdanning.ANNEN ? {
        spoersmaal: t("dinSituasjon.utdanning.annenUtdanning"),
        svar: soeknad.dinSituasjon.utdanning!!.annenUtdanning!!
    } : undefined;

    const opplysningAlternativAdresse: Opplysning<String> | undefined = soeknad.omDeg.bostedsadresseBekreftet === IValg.NEI ? {
        spoersmaal: t("omDeg.alternativAdresse"),
        svar: soeknad.omDeg.alternativAdresse!!
    } : undefined;


    // TODO: Slå sammen med ArbeidOgUtdanning ... ?
    const fullfoertUtdanning: BetingetOpplysning<HoeyesteUtdanning, Opplysning<AnnenUtdanning>> | undefined = !bruker.adressebeskyttelse ? {
        spoersmaal: t("dinSituasjon.utdanning.hoyesteFullfoerteUtdanning"),
        svar: konverterTilHoyesteUtdanning(soeknad.dinSituasjon.utdanning!!.hoyesteFullfoerteUtdanning!!),
        opplysning: annenUtdanning
    } : undefined;

    return {
        type: PersonType.GJENLEVENDE,

        fornavn: bruker.fornavn!!,
        etternavn: bruker.etternavn!!,
        foedselsnummer: bruker.foedselsnummer!!,

        statsborgerskap: `${bruker.statsborgerskap}`,
        sivilstatus: `${bruker.sivilstatus}`,

        adresse: {
            spoersmaal: t("felles.adresse"),
            svar: `${bruker.adresse}`
        },
        bostedsAdresse: !bruker.adressebeskyttelse ? {
            spoersmaal: t("omDeg.bostedsadresseBekreftet"),
            svar: valgTilSvar(soeknad.omDeg.bostedsadresseBekreftet!!), // TODO: Støtte riktig type,
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
            svar: valgTilSvar(soeknad.opplysningerOmBarn.gravidEllerNyligFoedt!!)
        },
        forholdTilAvdoede: mapForholdTilAvdoede(t, soeknad.omDegOgAvdoed.forholdTilAvdoede!!)
    }
};

const hentOppholdUtland = (t: TFunction, omDeg: ISoeker): BetingetOpplysning<Svar, OppholdUtland> => {
    let opplysning: OppholdUtland | undefined;

    if (omDeg.oppholderSegINorge === IValg.NEI) {
        opplysning = {
            land: {
                spoersmaal: t("omDeg.oppholdsland"),
                svar: omDeg.oppholdsland!!
            },
            medlemFolketrygd: {
                spoersmaal: t("omDeg.medlemFolketrygdenUtland"),
                svar: valgTilSvar(omDeg.medlemFolketrygdenUtland!!)
            }
        };
    }

    return {
        spoersmaal: t("omDeg.oppholderSegINorge"),
        svar: valgTilSvar(omDeg.oppholderSegINorge!!), // TODO: Korrigere type
        opplysning
    }
}

const hentSivilstatus = (t: TFunction, nySivilstatus: INySivilstatus): BetingetOpplysning<SivilstatusType, Samboer> => {
    let opplysning: Samboer | undefined;

    if (nySivilstatus?.sivilstatus == Sivilstatus.samboerskap) {
        const samboer = nySivilstatus.samboerskap!!.samboer!!;
        let inntekt: BetingetOpplysning<Svar, SamboerInntekt> | undefined;

        if (samboer.harInntekt?.svar === IValg.JA) {
            const inntektTypeSvar: InntektType[] = samboer.harInntekt?.inntektstype
                ?.map(type => konverterSamboerInntekt(type)) || [];

            inntekt = {
                spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar"),
                svar: valgTilSvar(samboer.harInntekt.svar), // TODO: Fikse type,
                opplysning: {
                    inntektstype: {
                        spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype"),
                        svar: inntektTypeSvar
                    },
                    samletBruttoinntektPrAar: {
                        spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.samletBruttoinntektPrAar"),
                        svar: samboer.harInntekt!!.samletBruttoinntektPrAar!!
                    }
                }
            }
        } else if (samboer.harInntekt?.svar === IValg.NEI) {
            inntekt = {
                spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar"),
                svar: valgTilSvar(samboer.harInntekt!!.svar!!), // TODO: Fikse type,
            };
        }

        opplysning = {
            type: PersonType.SAMBOER,
            fornavn: samboer.fornavn!!,
            etternavn: samboer.etternavn!!,
            foedselsnummer: samboer.foedselsnummer!!,
            fellesBarnEllertidligereGift: {
                spoersmaal: t("omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift"),
                svar: valgTilSvar(nySivilstatus.samboerskap!!.hattBarnEllerVaertGift!!), // TODO: Korrigere type
            },
            inntekt
        }
    }

    return {
        spoersmaal: t("omDegOgAvdoed.nySivilstatus.sivilstatus"),
        svar: konverterSivilstatus(nySivilstatus!!.sivilstatus!!),
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
                        svar: arbeid.arbeidsgiver!!
                    },
                    ansettelsesforhold: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.ansettelsesforhold"),
                        svar: konverterStillingType(arbeid.ansettelsesforhold!!)
                    },
                    stillingsprosent: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.stillingsprosent"),
                        svar: `${arbeid.stillingsprosent}`
                    },
                    endretInntekt: {
                        spoersmaal: t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar"),
                        svar: valgTilSvar(arbeid.forventerEndretInntekt!!.svar!!), // TODO: fikse type,
                        opplysning: {
                            spoersmaal: t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse"),
                            svar: `${arbeid.forventerEndretInntekt?.beskrivelse}`
                        }
                    }
                }

                return arbeidstaker;
            }) || []
        }
    }

    let annet: Opplysning<string> | undefined;
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.ingen)) {
        annet = {
            spoersmaal: t("dinSituasjon.ingenJobbBeskrivelse"),
            svar: dinSituasjon.ingenJobbBeskrivelse!!
        }
    }

    let selvstendig: Opplysning<SelvstendigNaeringsdrivende[]> | undefined;
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendig)) {
        const naeringListe: SelvstendigNaeringsdrivende[] = dinSituasjon.selvstendig?.map(naering => {
            return {
                firmanavn: {
                    spoersmaal: t("dinSituasjon.selvstendig.tittel"),
                    svar: naering.beskrivelse!!
                },
                orgnr: {
                    spoersmaal: t("dinSituasjon.selvstendig.orgnr"),
                    svar: naering.orgnr!!
                },
                endretInntekt: {
                    spoersmaal: t("dinSituasjon.selvstendig.forventerEndretInntekt.svar"),
                    svar: valgTilSvar(naering.forventerEndretInntekt!!.svar!!), // TODO: Fikse type
                    opplysning: {
                        spoersmaal: t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse"),
                        svar: `${naering.forventerEndretInntekt?.beskrivelse}`
                    }
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
                    svar: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.navn!!
                },
                startDato: {
                    spoersmaal: t("dinSituasjon.utdanning.naavaerendeUtdanning.startDato"),
                    svar: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.startDato!!
                },
                sluttDato: {
                    spoersmaal: t("dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato"),
                    svar: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.sluttDato!!
                },
            }
        }
    }

    return {
        dinSituasjon: {
            spoersmaal: t("dinSituasjon.jobbStatus"),
            svar: dinSituasjon.jobbStatus?.map(type => konverterJobbStatus(type)) || []
        },
        arbeidsforhold,
        selvstendig,
        utdanning,
        annet
    }
}

const hentAndreYtelser = (t: TFunction, dinSituasjon: ISituasjon): AndreYtelser => {
    const opplysningAnnetKrav: Opplysning<Ytelser> | undefined = dinSituasjon.andreYtelser?.kravOmAnnenStonad?.svar === IValg.JA ? {
        spoersmaal: t("dinSituasjon.andreYtelser.kravOmAnnenStonad.ytelser"),
        svar: konverterYtelser(dinSituasjon.andreYtelser!!.kravOmAnnenStonad!!.ytelser!!)
    } : undefined;

    return {
        kravOmAnnenStonad: {
            spoersmaal: t("dinSituasjon.andreYtelser.kravOmAnnenStonad.svar"),
            svar: valgTilSvar(dinSituasjon.andreYtelser!!.kravOmAnnenStonad!!.svar!!), // TODO: fikse type
            opplysning: opplysningAnnetKrav
        },
        annenPensjon: {
            spoersmaal: t("dinSituasjon.andreYtelser.annenPensjon.svar"),
            svar: valgTilSvar(dinSituasjon.andreYtelser!!.annenPensjon!!.svar!!), // TODO: fikse type
            opplysning: {
                spoersmaal: t("dinSituasjon.andreYtelser.annenPensjon.beskrivelse"),
                svar: `${dinSituasjon.andreYtelser?.annenPensjon?.beskrivelse}`
            }
        },
        pensjonUtland: {
            spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.svar"),
            svar: valgTilSvar(dinSituasjon.andreYtelser!!.mottarPensjonUtland!!.svar!!), // TODO: fikse type
            opplysning: {
                pensjonsType: {
                    spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"),
                    svar: `${dinSituasjon.andreYtelser?.mottarPensjonUtland?.hvaSlagsPensjon}`
                },
                land: {
                    spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand"),
                    svar: `${dinSituasjon.andreYtelser?.mottarPensjonUtland?.fraHvilketLand}`
                },
                bruttobeloepPrAar: {
                    spoersmaal: t("dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"),
                    svar: `${dinSituasjon.andreYtelser?.mottarPensjonUtland?.bruttobeloepPrAar}`
                }
            }
        }
    }
}

const mapForholdTilAvdoede = (t: TFunction, forholdTilAvdoede: IForholdAvdoede): ForholdTilAvdoede => {
    const relasjon: Opplysning<ForholdTilAvdoedeType> = {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.relasjon"),
        svar: konverterRelasjonAvdoed(forholdTilAvdoede.relasjon!!)
    };

    const datoForInngaattPartnerskap: Opplysning<Date> | undefined = !!forholdTilAvdoede.datoForInngaattPartnerskap ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap"),
        svar: forholdTilAvdoede.datoForInngaattPartnerskap
    } : undefined;

    const datoForSkilsmisse: Opplysning<Date> | undefined = !!forholdTilAvdoede.datoForSkilsmisse ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse"),
        svar: forholdTilAvdoede.datoForSkilsmisse
    } : undefined;

    const samboereMedFellesBarnFoerGiftemaal: Opplysning<Svar> | undefined = !!forholdTilAvdoede.samboereMedFellesBarn ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn"),
        svar: valgTilSvar(forholdTilAvdoede.samboereMedFellesBarn)
    } : undefined;

    const mottokEktefelleBidrag: Opplysning<Svar> | undefined = !!forholdTilAvdoede.mottokEktefelleBidrag ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag"),
        svar: valgTilSvar(forholdTilAvdoede.mottokEktefelleBidrag)
    } : undefined;

    const datoForInngaattSamboerskap: Opplysning<Date> | undefined = !!forholdTilAvdoede.datoForInngaattSamboerskap ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap"),
        svar: forholdTilAvdoede.datoForInngaattSamboerskap
    } : undefined;

    const datoForSamlivsbrudd: Opplysning<Date> | undefined = !!forholdTilAvdoede.datoForSamlivsbrudd ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd"),
        svar: forholdTilAvdoede.datoForSamlivsbrudd
    } : undefined;

    const fellesBarn: Opplysning<Svar> | undefined = !!forholdTilAvdoede.fellesBarn ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn"),
        svar: valgTilSvar(forholdTilAvdoede.fellesBarn)
    } : undefined;

    const tidligereGift: Opplysning<Svar> | undefined = !!forholdTilAvdoede.tidligereGift ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.tidligereGift"),
        svar: valgTilSvar(forholdTilAvdoede.tidligereGift)
    } : undefined;

    const omsorgForBarn: Opplysning<Svar> | undefined = !!forholdTilAvdoede.omsorgForBarn ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn"),
        svar: valgTilSvar(forholdTilAvdoede.omsorgForBarn)
    } : undefined;

    const mottokBidrag: Opplysning<Svar> | undefined = !!forholdTilAvdoede.mottokBidrag ? {
        spoersmaal: t("omDegOgAvdoed.forholdTilAvdoede.mottokBidrag"),
        svar: valgTilSvar(forholdTilAvdoede.mottokBidrag)
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
