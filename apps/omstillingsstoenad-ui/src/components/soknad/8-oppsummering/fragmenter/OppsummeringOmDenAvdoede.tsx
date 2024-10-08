import { Heading, Tag } from '@navikt/ds-react'
import { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { IAvdoed } from '../../../../typer/person'
import { useTranslation } from 'react-i18next'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { Panel } from '../../../felles/Panel'

interface Props {
    omDenAvdoede: IAvdoed
    senderSoeknad: boolean
}

export const OppsummeringOmDenAvdoede = memo(({ omDenAvdoede, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.OmAvdoed)}
            path={`/skjema/steg/${StegPath.OmAvdoed}`}
            pathText={StegPath.OmAvdoed}
            senderSoeknad={senderSoeknad}
        >
            <Panel>
                <Heading size={'small'}>{t('omDeg.undertittel.personalia')}</Heading>
                <PersonInfoOppsummering
                    fornavn={omDenAvdoede.fornavn}
                    etternavn={omDenAvdoede.etternavn}
                    fnrDnr={omDenAvdoede.foedselsnummer}
                    foedselsdato={omDenAvdoede.foedselsdato}
                    statsborgerskap={omDenAvdoede.statsborgerskap}
                />
                <TekstGruppe tittel={t('omDenAvdoede.datoForDoedsfallet')} innhold={omDenAvdoede.datoForDoedsfallet} />

                <TekstGruppeJaNeiVetIkke
                    tittel={t('omDenAvdoede.doedsfallAarsak')}
                    innhold={omDenAvdoede.doedsfallAarsak}
                />
            </Panel>

            <Panel>
                <Heading size={'small'}>{t('omDenAvdoede.boddEllerJobbetUtland.tittel')}</Heading>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('omDenAvdoede.boddEllerJobbetUtland.svar')}
                    innhold={omDenAvdoede.boddEllerJobbetUtland?.svar}
                />
                {omDenAvdoede.boddEllerJobbetUtland?.oppholdUtland?.map((opphold, index) => (
                    <Panel key={index}>
                        <Tag variant={'neutral-moderate'}>{`Opphold i ${opphold.land}`}</Tag>
                        <TekstGruppe
                            tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land')}
                            innhold={opphold.land}
                        />
                        <TekstGruppe
                            tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse')}
                            innhold={opphold.beskrivelse?.map((item) => ` ${t(item)}`)}
                        />
                        {opphold.fraDato && (
                            <TekstGruppe
                                tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato')}
                                innhold={opphold.fraDato}
                            />
                        )}
                        {opphold.tilDato && (
                            <TekstGruppe
                                tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato')}
                                innhold={opphold.tilDato}
                            />
                        )}
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd')}
                            innhold={opphold.medlemFolketrygd}
                        />

                        {opphold.mottokPensjon?.beloep && (
                            <TekstGruppe tittel={t('felles.aarligBeloep')} innhold={opphold.mottokPensjon.beloep} />
                        )}

                        {opphold.mottokPensjon?.valuta && (
                            <TekstGruppe tittel={t('felles.velgValuta')} innhold={opphold.mottokPensjon.valuta} />
                        )}
                    </Panel>
                ))}
            </Panel>
        </AccordionItem>
    )
})
