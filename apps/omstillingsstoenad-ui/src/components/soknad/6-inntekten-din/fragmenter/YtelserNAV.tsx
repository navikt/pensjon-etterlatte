import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, SoekbareYtelserNAV } from '../../../../typer/inntekt'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'

const YtelserNAV = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const harSoektYtelse = watch('ytelserNAV.svar')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'ytelserNAV.svar'}
                    legend={t('inntektenDin.ytelserNAV.svar')}
                    description={t('inntektenDin.ytelserNAV.hvorfor')}
                />
            </SkjemaElement>
            {harSoektYtelse === IValg.JA && (
                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'ytelserNAV.soekteYtelser'}
                        legend={t('inntektenDin.ytelserNAV.soekteYtelser')}
                        checkboxes={Object.values(SoekbareYtelserNAV).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default YtelserNAV
