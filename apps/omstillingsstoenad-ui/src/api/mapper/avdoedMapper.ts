import { TFunction } from 'i18next'
import { ISoeknad } from '../../context/soknad/soknad'
import {
    EnumSvar,
    NaeringsinntektAvdoed,
    OppholdUtlandType,
    Utenlandsopphold,
} from '../dto/FellesOpplysninger'
import { Avdoed, PersonType } from '../dto/Person'
import { IValg } from '../../typer/Spoersmaal'
import { valgTilSvar } from './fellesMapper'
import { konverterOpphold } from './typeMapper'

export const mapAvdoed = (t: TFunction, soeknad: ISoeknad): Avdoed => {
    let oppholdUtland: Utenlandsopphold[] | undefined

    if (soeknad.omDenAvdoede.boddEllerJobbetUtland?.svar === IValg.JA) {
        oppholdUtland =
            soeknad.omDenAvdoede.boddEllerJobbetUtland.oppholdUtland?.map((info) => {
                const oppholdsTypeListe: EnumSvar<OppholdUtlandType>[] =
                    info.beskrivelse?.map((type) => ({
                        verdi: konverterOpphold(type),
                        innhold: t(type),
                    })) || []

                const utenlandsopphold: Utenlandsopphold = {
                    land: {
                        spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land'),
                        svar: {
                            innhold: info.land!!,
                        },
                    },
                    fraDato: info.fraDato
                        ? {
                              spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato'),
                              svar: {
                                  innhold: info.fraDato!!,
                              },
                          }
                        : undefined,
                    tilDato: info.tilDato
                        ? {
                              spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato'),
                              svar: {
                                  innhold: info.tilDato!!,
                              },
                          }
                        : undefined,
                    oppholdsType: {
                        spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse'),
                        svar: oppholdsTypeListe,
                    },
                    medlemFolketrygd: {
                        spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd'),
                        svar: valgTilSvar(t, info.medlemFolketrygd!!),
                    },
                    pensjonsutbetaling: {
                        spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse'),
                        svar: {
                            innhold: info.mottokPensjon?.beskrivelse || '-',
                        },
                    },
                }

                return utenlandsopphold
            }) || []
    }

    let opplysningNaeringsInntekt: NaeringsinntektAvdoed | undefined
    if (soeknad.omDenAvdoede.selvstendigNaeringsdrivende?.svar === IValg.JA) {
        opplysningNaeringsInntekt = {
            naeringsinntektPrAarFoerDoedsfall: {
                spoersmaal: t('omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse'),
                svar: {
                    innhold: `${soeknad.omDenAvdoede.selvstendigNaeringsdrivende?.beskrivelse}`,
                },
            },
            naeringsinntektVedDoedsfall: {
                spoersmaal: t('omDenAvdoede.haddePensjonsgivendeInntekt.svar'),
                svar: valgTilSvar(t, soeknad.omDenAvdoede.haddePensjonsgivendeInntekt!!.svar!!), // TODO: Fikse type
            },
        }
    }

    return {
        type: PersonType.AVDOED,

        fornavn: {
            spoersmaal: t('omDenAvdoede.fornavn'),
            svar: soeknad.omDenAvdoede.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('omDenAvdoede.etternavn'),
            svar: soeknad.omDenAvdoede.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('omDenAvdoede.foedselsnummer'),
            svar: soeknad.omDenAvdoede.foedselsnummer!!,
        },

        datoForDoedsfallet: {
            spoersmaal: t('omDenAvdoede.datoForDoedsfallet'),
            svar: {
                innhold: soeknad.omDenAvdoede.datoForDoedsfallet!!,
            },
        },
        statsborgerskap: {
            spoersmaal: t('omDenAvdoede.statsborgerskap'),
            svar: {
                innhold: soeknad.omDenAvdoede.statsborgerskap!!,
            },
        },
        utenlandsopphold: {
            spoersmaal: t('omDenAvdoede.boddEllerJobbetUtland.svar'),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.boddEllerJobbetUtland!!.svar!!), // TODO: Fikse type
            opplysning: oppholdUtland,
        },
        naeringsInntekt: {
            spoersmaal: t('omDenAvdoede.selvstendigNaeringsdrivende.svar'),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.selvstendigNaeringsdrivende!!.svar!!), // TODO: Fikse type
            opplysning: opplysningNaeringsInntekt,
        },
        doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: {
            spoersmaal: t('omDenAvdoede.doedsfallAarsak'),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.doedsfallAarsak!!),
        },
    }
}
