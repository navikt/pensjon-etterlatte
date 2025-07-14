import { Box, Heading, List, ReadMore } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Bredde from '../../../../typer/bredde'
import { IInntekt } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInputArea, RHFValutaInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { ListItemWithIndent } from '../../../felles/StyledComponents'

const IngenInntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const harInntekt = watch('ingenInntekt.svar')

    return (
        <>
            <SkjemaGruppe>
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
                                    <List size={'small'}>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li1')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li2')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li3')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li4')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li5')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li6')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li7')}
                                        </ListItemWithIndent>
                                        <ListItemWithIndent>
                                            {t('inntektenDin.ingenInntekt.hvaRegnesSominntekt.innhold.li8')}
                                        </ListItemWithIndent>
                                    </List>
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
            </SkjemaGruppe>
        </>
    )
}

export default IngenInntekt
