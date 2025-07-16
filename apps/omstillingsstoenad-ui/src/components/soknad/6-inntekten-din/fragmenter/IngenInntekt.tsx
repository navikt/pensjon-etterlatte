import { Box, Heading, List, ReadMore } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Bredde from '../../../../typer/bredde'
import { IInntekt } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInputArea, RHFValutaInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const IngenInntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const harInntekt = watch('ingenInntekt.svar')

    return (
        <>
            <Box marginBlock="0 12">
                <Box marginBlock="4">
                    <Heading size={'medium'}>{t('inntektenDin.ingenInntekt.tittel')}</Heading>
                </Box>

                <>
                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio name={`ingenInntekt.svar`} legend={t('inntektenDin.ingenInntekt.svar')} />
                    </Box>
                    {harInntekt === IValg.JA && (
                        <>
                            <Box marginBlock="4">
                                <ReadMore header={t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.tittel')}>
                                    {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold')}

                                    <Box marginInline="4 0">
                                        <List size={'small'}>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li1')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li2')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li3')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li4')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li5')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li6')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li7')}
                                            </List.Item>
                                            <List.Item>
                                                {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li8')}
                                            </List.Item>
                                        </List>
                                    </Box>
                                </ReadMore>
                            </Box>

                            <Box marginBlock="4">
                                <RHFInputArea
                                    name={`ingenInntekt.beskrivelse`}
                                    label={t('inntektenDin.ingenInntekt.beskrivelse')}
                                    maxLength={100}
                                    className={'width-50'}
                                />
                            </Box>
                            <Box marginBlock="4">
                                <RHFValutaInput
                                    name={'ingenInntekt.beloep'}
                                    label={t('inntektenDin.ingenInntekt.beloep')}
                                    htmlSize={Bredde.S}
                                />
                            </Box>
                        </>
                    )}
                </>
            </Box>
        </>
    )
}

export default IngenInntekt
