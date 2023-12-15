import { Heading, Panel, Tag } from '@navikt/ds-react'
import React, { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { IOmBarn } from '../../../../typer/person'
import { useTranslation } from 'react-i18next'
import { StegPath } from '../../../../typer/steg'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import { IValg } from '../../../../typer/Spoersmaal'
import { SkjemaElement } from '../../../felles/SkjemaElement'

interface Props {
    opplysningerOmBarn: IOmBarn
}

export const OppsummeringBarnepensjon = memo(({ opplysningerOmBarn }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t('omBarn.tittel')}
            path={`/skjema/steg/${StegPath.OmBarn}`}
            pathText={t('omBarn.tittel')}
        >
            <Panel>
                {opplysningerOmBarn.barn?.map((barnet, index) => (
                    <Panel key={index}>
                        <SkjemaElement>
                            <Heading size={'small'} spacing>{`${barnet.fornavn} ${barnet.etternavn}`}</Heading>
                            {barnet.barnepensjon?.soeker && (
                                <Tag variant={'success'}>{t('omBarn.barnepensjon.soekt')}</Tag>
                            )}
                        </SkjemaElement>

                        <PersonInfoOppsummering
                            fornavn={barnet.fornavn}
                            etternavn={barnet.etternavn}
                            fnrDnr={barnet.foedselsnummer}
                            statsborgerskap={barnet.statsborgerskap}
                        />

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omBarn.bosattUtland.svar')}
                            innhold={barnet.bosattUtland?.svar}
                        />

                        {barnet.bosattUtland?.svar === IValg.JA && (
                            <Panel>
                                <TekstGruppe
                                    tittel={t('omBarn.bosattUtland.land')}
                                    innhold={barnet.bosattUtland.land}
                                />
                                <TekstGruppe
                                    tittel={t('omBarn.bosattUtland.adresse')}
                                    innhold={barnet.bosattUtland.adresse}
                                />
                            </Panel>
                        )}

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omBarn.harBarnetVerge.svar')}
                            innhold={barnet.harBarnetVerge?.svar}
                        />

                        {barnet.harBarnetVerge?.svar === IValg.JA && (
                            <Panel>
                                {barnet.harBarnetVerge.fornavn && (
                                    <TekstGruppe
                                        tittel={t('omBarn.harBarnetVerge.fornavn')}
                                        innhold={barnet.harBarnetVerge.fornavn}
                                    />
                                )}
                                {barnet.harBarnetVerge.etternavn && (
                                    <TekstGruppe
                                        tittel={t('omBarn.harBarnetVerge.etternavn')}
                                        innhold={barnet.harBarnetVerge.etternavn}
                                    />
                                )}
                                {barnet.harBarnetVerge.foedselsnummer && (
                                    <TekstGruppe
                                        tittel={t('omBarn.harBarnetVerge.foedselsnummer')}
                                        innhold={barnet.harBarnetVerge.foedselsnummer}
                                    />
                                )}
                            </Panel>
                        )}

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omBarn.barnepensjon.kontonummer.svar')}
                            innhold={barnet.barnepensjon?.kontonummer?.svar}
                        />

                        {barnet.barnepensjon?.kontonummer?.svar === IValg.NEI && (
                            <Panel>
                                <TekstGruppe
                                    tittel={t('omBarn.barnepensjon.kontonummer.kontonummer')}
                                    innhold={barnet.barnepensjon.kontonummer.kontonummer}
                                />
                            </Panel>
                        )}

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omBarn.barnepensjon.forskuddstrekk.svar')}
                            innhold={barnet.barnepensjon?.forskuddstrekk?.svar}
                        />

                        {barnet.barnepensjon?.forskuddstrekk?.svar === IValg.JA && (
                            <Panel>
                                <TekstGruppe
                                    tittel={t('omBarn.barnepensjon.forskuddstrekk.trekkprosent')}
                                    innhold={barnet.barnepensjon.forskuddstrekk.trekkprosent}
                                />
                            </Panel>
                        )}

                        {barnet.barnepensjon?.soeker && (
                            <TekstGruppe
                                tittel={t('omBarn.barnepensjon.soeker')}
                                innhold={t('omBarn.barnepensjon.soekt')}
                            />
                        )}
                    </Panel>
                ))}
            </Panel>
        </AccordionItem>
    )
})
