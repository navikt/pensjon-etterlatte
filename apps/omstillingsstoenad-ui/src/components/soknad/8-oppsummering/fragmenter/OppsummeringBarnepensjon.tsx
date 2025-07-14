import { BodyShort, Box, Heading, Tag } from '@navikt/ds-react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { IOmBarn } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import { StegPath } from '../../../../typer/steg'
import { Panel } from '../../../felles/Panel'
import { AccordionItem } from '../AccordionItem'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import UtbetalingsInformasjonOppsummering from './UtbetalingsInformasjonOppsummering'

interface Props {
    opplysningerOmBarn: IOmBarn
    senderSoeknad: boolean
}

export const OppsummeringBarnepensjon = memo(({ opplysningerOmBarn, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t('omBarn.tittel')}
            path={`/skjema/steg/${StegPath.OmBarn}`}
            pathText={StegPath.OmBarn}
            senderSoeknad={senderSoeknad}
        >
            <Panel>
                {opplysningerOmBarn.barn?.map((barnet, index) => (
                    <Panel key={index}>
                        <Box marginBlock="4">
                            <Heading size={'small'} spacing>{`${barnet.fornavn} ${barnet.etternavn}`}</Heading>
                            {barnet.barnepensjon?.soeker && (
                                <Tag variant={'success'}>{t('omBarn.barnepensjon.soekt')}</Tag>
                            )}
                        </Box>

                        <PersonInfoOppsummering
                            fornavn={barnet.fornavn}
                            etternavn={barnet.etternavn}
                            fnrDnr={barnet.foedselsnummer}
                            foedselsdato={barnet.foedselsdato}
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

                        {barnet.harBarnetVerge?.svar && (
                            <TekstGruppeJaNeiVetIkke
                                tittel={t('omBarn.harBarnetVerge.svar')}
                                innhold={barnet.harBarnetVerge?.svar}
                            />
                        )}

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

                        {barnet.barnepensjon?.kontonummer?.svar && (
                            <TekstGruppeJaNeiVetIkke
                                tittel={t('omBarn.barnepensjon.kontonummer.svar')}
                                innhold={barnet.barnepensjon?.kontonummer?.svar}
                            />
                        )}

                        {barnet.barnepensjon?.kontonummer?.svar === IValg.NEI && (
                            <Panel>
                                <UtbetalingsInformasjonOppsummering
                                    utbetalingsInformasjon={barnet.barnepensjon.utbetalingsInformasjon!}
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

                {!opplysningerOmBarn.barn?.length && <BodyShort>{t('omBarn.ikkeSoekt')}</BodyShort>}
            </Panel>
        </AccordionItem>
    )
})
