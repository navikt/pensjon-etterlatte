import { TFunction } from 'i18next'
import { IBruker } from '../context/bruker/bruker'
import { ISoeknad } from '../context/soknad/soknad'
import { IArbeidsforhold, ISelvstendigNaeringsdrivende } from '../typer/arbeidsforhold'
import {
    IAvdoed,
    IOmBarn,
    ISituasjonenDin,
    IOppholdUtland,
    ISoeker,
    ISoekerOgAvdoed,
    Sivilstatus,
} from '../typer/person'
import { IMerOmSituasjonenDin } from '../typer/situasjon'
import { StegPath } from '../typer/steg'
import ObjectTreeReader, { Element, Gruppe } from './ObjectTreeReader'
import { IAnnenInntekt, IInntekt, ILoennsinntekt, INaeringsinntekt, IPensjonEllerUfoere } from '../typer/inntekt'

export default class SoeknadMapper {
    private otr: ObjectTreeReader
    private readonly t: TFunction

    constructor(t: TFunction) {
        this.t = t
        this.otr = new ObjectTreeReader(t)
    }

    lagOppsummering(soeknad: ISoeknad, bruker: IBruker): Gruppe[] {
        return [
            this.mapOmDeg(soeknad.omDeg, bruker),
            this.mapOmDenAvdoede(soeknad.omDenAvdoede),
            this.mapOmDegOgAvdoed(soeknad.omDegOgAvdoed),
            this.mapDinSituasjon(soeknad.dinSituasjon),
            this.mapInntektenDin(soeknad.inntektenDin),
            this.mapOmsorgForBarn(soeknad.omsorgForBarn),
            this.mapOpplysningerOmBarn(soeknad.opplysningerOmBarn),
        ]
    }

    private mapOmDeg(omDeg: ISoeker, bruker: IBruker): Gruppe {
        const personalia = {
            navn: `${bruker.fornavn} ${bruker.etternavn}`,
            foedselsnummer: bruker.foedselsnummer,
            adresse: !bruker.adressebeskyttelse
                ? `${bruker.adresse} ${bruker.husnummer}${bruker.husbokstav || ''}, ${bruker.postnummer} ${
                      bruker.poststed
                  }`
                : null,
            sivilstatus: bruker.sivilstatus,
            statsborgerskap: bruker.statsborgerskap,
        }

        return {
            tittel: this.t('omDeg.tittel'),
            path: StegPath.OmDeg,
            elementer: [
                {
                    tittel: this.t('omDeg.undertittel.personalia'),
                    innhold: this.otr.traverse(personalia, 'felles'),
                },
                {
                    tittel: this.t('omDeg.undertittel.opplysningerOmSoeker'),
                    innhold: this.otr.traverse<ISoeker>(
                        {
                            ...omDeg,
                            nySivilstatus: {
                                ...omDeg.nySivilstatus,
                                sivilstatus: this.t(omDeg.nySivilstatus?.sivilstatus || '') as Sivilstatus,
                            },
                            erValidert: undefined,
                        },
                        'omDeg'
                    ),
                },
            ],
        }
    }

    private mapOmDegOgAvdoed(omDegOgAvdoed: ISoekerOgAvdoed): Gruppe {
        return {
            tittel: this.t('omDegOgAvdoed.tittel'),
            path: StegPath.OmDegOgAvdoed,
            elementer: [
                {
                    innhold: this.otr.traverse<ISoekerOgAvdoed>(
                        {
                            ...omDegOgAvdoed,
                            erValidert: undefined,
                        },
                        'omDegOgAvdoed'
                    ),
                },
            ],
        }
    }

    private mapOmDenAvdoede(omDenAvdoede: IAvdoed): Gruppe {
        const oppholdUtland: Element[] =
            omDenAvdoede.boddEllerJobbetUtland?.oppholdUtland?.map((oppholdUtland) => {
                const opphold: IOppholdUtland = {
                    land: oppholdUtland.land,
                    beskrivelse: oppholdUtland.beskrivelse,
                    fraDato: oppholdUtland.fraDato,
                    tilDato: oppholdUtland.tilDato,
                    medlemFolketrygd: oppholdUtland.medlemFolketrygd,
                    mottokPensjon: oppholdUtland.mottokPensjon,
                }

                return {
                    tittel: `Opphold i ${opphold.land}`,
                    innhold: this.otr.traverse(
                        {
                            ...opphold,
                            beskrivelse: opphold.beskrivelse?.map((val) => this.t(val)).join(', '),
                        },
                        'omDenAvdoede.boddEllerJobbetUtland.oppholdUtland'
                    ),
                } as Element
            }) || []

        return {
            tittel: this.t('omDenAvdoede.tittel'),
            path: StegPath.OmAvdoed,
            elementer: [
                {
                    innhold: this.otr.traverse<IAvdoed>(
                        {
                            ...omDenAvdoede,
                            boddEllerJobbetUtland: { svar: omDenAvdoede.boddEllerJobbetUtland?.svar },
                            erValidert: undefined,
                        },
                        'omDenAvdoede'
                    ),
                },
                ...oppholdUtland,
            ],
        }
    }

    private mapDinSituasjon(dinSituasjon: IMerOmSituasjonenDin): Gruppe {
        const arbeidsforhold: Element[] =
            dinSituasjon.arbeidsforhold?.map((arbeid) => {
                return {
                    tittel: `${arbeid.arbeidsgiver}`,
                    innhold: this.otr.traverse<IArbeidsforhold>(
                        {
                            ...arbeid,
                            arbeidsgiver: undefined,
                        },
                        'merOmSituasjonenDin.arbeidsforhold'
                    ),
                } as Element
            }) || []

        const selvstendigNaeringsdrivendeENK: Element[] =
            dinSituasjon.selvstendig?.enk?.map((arbeid) => {
                return {
                    tittel: `${arbeid.beskrivelse}`,
                    innhold: this.otr.traverse<ISelvstendigNaeringsdrivende>(
                        {
                            ...arbeid,
                            beskrivelse: undefined,
                        },
                        'merOmSituasjonenDin.selvstendig'
                    ),
                } as Element
            }) || []

        const selvstendigNaeringsdrivendeAS: Element[] =
            dinSituasjon.selvstendig?.as?.map((arbeid) => {
                return {
                    tittel: `${arbeid.beskrivelse}`,
                    innhold: this.otr.traverse<ISelvstendigNaeringsdrivende>(
                        {
                            ...arbeid,
                            beskrivelse: undefined,
                        },
                        'merOmSituasjonenDin.selvstendig'
                    ),
                } as Element
            }) || []

        return {
            tittel: this.t('merOmSituasjonenDin.tittel'),
            path: StegPath.MerOmSituasjonenDin,
            elementer: [
                {
                    innhold: this.otr.traverse<IMerOmSituasjonenDin>(
                        {
                            ...dinSituasjon,
                            arbeidsforhold: undefined,
                            selvstendig: undefined,
                            erValidert: undefined,
                        },
                        'merOmSituasjonenDin'
                    ),
                },
                ...arbeidsforhold,
                ...selvstendigNaeringsdrivendeENK,
                ...selvstendigNaeringsdrivendeAS,
            ],
        }
    }

    private mapInntektenDin(inntektenDin: IInntekt): Gruppe {
        const inntekter: Element[] = []

        if (!!inntektenDin.loennsinntekt) {
            const loennsinntekt: Element = {
                tittel: this.t('inntektenDin.loennsinntekt.tittel'),
                innhold: this.otr.traverse<ILoennsinntekt>(
                    {
                        ...inntektenDin.loennsinntekt,
                    },
                    'inntektenDin.loennsinntekt'
                ),
            }
            inntekter.push(loennsinntekt)
        }

        if (!!inntektenDin.naeringsinntekt) {
            const naeringsinntekt: Element = {
                tittel: this.t('inntektenDin.naeringsinntekt.tittel'),
                innhold: this.otr.traverse<INaeringsinntekt>(
                    {
                        ...inntektenDin.naeringsinntekt,
                    },
                    'inntektenDin.naeringsinntekt'
                ),
            }
            inntekter.push(naeringsinntekt)
        }

        if (!!inntektenDin.pensjonEllerUfoere) {
            const pensjonEllerUfoere: Element = {
                tittel: this.t('inntektenDin.pensjonEllerUfoere.tittel'),
                innhold: this.otr.traverse<IPensjonEllerUfoere>(
                    {
                        ...inntektenDin.pensjonEllerUfoere,
                    },
                    'inntektenDin.pensjonEllerUfoere'
                ),
            }
            inntekter.push(pensjonEllerUfoere)
        }

        if (!!inntektenDin.annenInntekt) {
            const annenInntekt: Element = {
                tittel: this.t('inntektenDin.annenInntekt.tittel'),
                innhold: this.otr.traverse<IAnnenInntekt>(
                    {
                        ...inntektenDin.annenInntekt,
                    },
                    'inntektenDin.annenInntekt'
                ),
            }
            inntekter.push(annenInntekt)
        }

        return {
            tittel: this.t('inntektenDin.tittel'),
            path: StegPath.InntektenDin,
            elementer: [
                ...inntekter,
                {
                    innhold: this.otr.traverse<IInntekt>(
                        {
                            ...inntektenDin,
                            inntektstyper: undefined,
                            loennsinntekt: undefined,
                            naeringsinntekt: undefined,
                            pensjonEllerUfoere: undefined,
                            annenInntekt: undefined,
                            erValidert: undefined,
                        },
                        'inntektenDin'
                    ),
                },
            ],
        }
    }

    private mapOmsorgForBarn(omsorgForBarn: ISituasjonenDin): Gruppe {
        return {
            tittel: this.t('omsorgForBarn.tittel'),
            path: StegPath.SituasjonenDin,
            elementer: [
                {
                    innhold: this.otr.traverse<ISituasjonenDin>(
                        {
                            ...omsorgForBarn,
                            erValidert: undefined,
                        },
                        'omsorgForBarn'
                    ),
                },
            ],
        }
    }

    private mapOpplysningerOmBarn(opplysningerOmBarn: IOmBarn): Gruppe {
        const barn: Element[] =
            opplysningerOmBarn.barn?.map((barn) => {
                return {
                    tittel: `${barn.fornavn} ${barn.etternavn}`,
                    innhold: this.otr.traverse(barn, 'omBarn'),
                } as Element
            }) || []

        return {
            tittel: this.t('omBarn.tittel'),
            path: StegPath.OmBarn,
            elementer: [
                {
                    innhold: this.otr.traverse<IOmBarn>(
                        {
                            ...opplysningerOmBarn,
                            barn: undefined,
                            erValidert: undefined,
                        },
                        'omBarn'
                    ),
                },
                ...barn,
            ],
        }
    }
}
