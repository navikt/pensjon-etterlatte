import { Heading, Panel, Tag } from '@navikt/ds-react'
import { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { IAvdoed } from '../../../../typer/person'
import { useTranslation } from 'react-i18next'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { IValg } from '../../../../typer/Spoersmaal'

interface Props {
    omDenAvdoede: IAvdoed
}

export const OppsummeringOmDenAvdoede = memo(({ omDenAvdoede }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.OmAvdoed)}
            path={`/skjema/steg/${StegPath.OmAvdoed}`}
            pathText={t(StegLabelKey.OmAvdoed)}
        >
            <Panel>
                <Heading size={'small'}>{t('omDeg.undertittel.personalia')}</Heading>
                <PersonInfoOppsummering
                    fornavn={omDenAvdoede.fornavn}
                    etternavn={omDenAvdoede.etternavn}
                    fnrDnr={omDenAvdoede.foedselsnummer}
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
                        {opphold.tilDato && (
                            <TekstGruppe
                                tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato')}
                                innhold={opphold.tilDato}
                            />
                        )}
                        {opphold.fraDato && (
                            <TekstGruppe
                                tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato')}
                                innhold={opphold.fraDato}
                            />
                        )}
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd')}
                            innhold={opphold.medlemFolketrygd}
                        />

                        {opphold.mottokPensjon?.beskrivelse && (
                            <TekstGruppe
                                tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse')}
                                innhold={opphold.mottokPensjon.beskrivelse}
                            />
                        )}
                    </Panel>
                ))}
            </Panel>

            <Panel>
                <Heading size={'small'}>{t('omDenAvdoede.selvstendigNaeringsdrivende.tittel')}</Heading>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('omDenAvdoede.selvstendigNaeringsdrivende.svar')}
                    innhold={omDenAvdoede.selvstendigNaeringsdrivende?.svar}
                />
                {omDenAvdoede.selvstendigNaeringsdrivende?.svar === IValg.JA && (
                    <>
                        {omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse && (
                            <TekstGruppe
                                tittel={t('omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse')}
                                innhold={omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse}
                            />
                        )}
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omDenAvdoede.haddePensjonsgivendeInntekt.svar')}
                            innhold={omDenAvdoede.haddePensjonsgivendeInntekt?.svar}
                        />
                    </>
                )}
            </Panel>
        </AccordionItem>
    )
})
