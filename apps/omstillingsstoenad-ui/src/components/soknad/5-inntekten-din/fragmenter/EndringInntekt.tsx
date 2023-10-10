import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { EndringAvInntektGrunn, IInntekt } from '../../../../typer/inntekt'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInput } from '../../../felles/rhf/RHFInput'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import Bredde from '../../../../typer/bredde'

const EndringInntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const endrerInntekt = watch('forventerEndringAvInntekt.svar')
    const endringAvInntektGrunn = watch('forventerEndringAvInntekt.grunn')

    const endringAvInntektGrunner = Object.values(EndringAvInntektGrunn).map((value) => {
        return { label: t(value), value: value }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <RHFSpoersmaalRadio name={'forventerEndringAvInntekt.svar'} legend={t('inntektenDin.forventerEndringAvInntekt.svar')} vetIkke />
            </SkjemaElement>
            {endrerInntekt === IValg.JA && (
                <SkjemaElement>
                    <RHFSelect
                        name={'forventerEndringAvInntekt.grunn'}
                        label={t('inntektenDin.forventerEndringAvInntekt.grunn')}
                        selectOptions={[
                            {
                                label: t('felles.velg'),
                                value: '',
                            },
                        ].concat(endringAvInntektGrunner)}
                    />
                </SkjemaElement>
            )}
            {endringAvInntektGrunn === EndringAvInntektGrunn.annenGrunn && (
                <SkjemaElement>
                    <RHFInput
                        name={'forventerEndringAvInntekt.annenGrunn'}
                        label={t('inntektenDin.forventerEndringAvInntekt.annenGrunn')}
                        htmlSize={Bredde.M}
                    />
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default EndringInntekt
