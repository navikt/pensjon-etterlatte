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

    const harInntekt = watch('annenInntekt.svar')

    return (
        <>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'medium'}>{t('inntektenDin.annenInntekt.tittel')}</Heading>
                </SkjemaElement>

                <>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio name={`annenInntekt.svar`} legend={t('inntektenDin.annenInntekt.svar')} />
                    </SkjemaElement>
                    {harInntekt === IValg.JA && (
                        <>
                            <SkjemaElement>
                                <RHFValutaInput
                                    name={'annenInntekt.beloep'}
                                    label={t('inntektenDin.annenInntekt.beloep')}
                                    htmlSize={Bredde.S}
                                />
                            </SkjemaElement>

                            <SkjemaElement>
                                <RHFInputArea
                                    name={`annenInntekt.beskrivelse`}
                                    label={t('inntektenDin.annenInntekt.beskrivelse')}
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
