import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { IInntekt } from '../../../../typer/inntekt'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { Heading } from '@navikt/ds-react'
import { RHFInputArea, RHFValutaInput } from '../../../felles/rhf/RHFInput'
import Bredde from '../../../../typer/bredde'
import React from 'react'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'

const IngenInntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const harInntekt = watch('ingenInntekt.svar')

    return (
        <>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'medium'}>{t('inntektenDin.ingenInntekt.tittel')}</Heading>
                </SkjemaElement>

                <>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio name={`ingenInntekt.svar`} legend={t('inntektenDin.ingenInntekt.svar')} />
                    </SkjemaElement>
                    {harInntekt === IValg.JA && (
                        <>
                            <SkjemaElement>
                                <RHFValutaInput
                                    name={'ingenInntekt.beloep'}
                                    label={t('inntektenDin.ingenInntekt.beloep')}
                                    htmlSize={Bredde.S}
                                />
                            </SkjemaElement>

                            <SkjemaElement>
                                <RHFInputArea
                                    name={`ingenInntekt.beskrivelse`}
                                    label={t('inntektenDin.ingenInntekt.beskrivelse')}
                                    maxLength={100}
                                    className={'width-50'}
                                />
                            </SkjemaElement>
                        </>
                    )}
                </>
            </SkjemaGruppe>
        </>
    )
}

export default IngenInntekt
