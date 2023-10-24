import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, SoekbareYtelserNAV } from '../../../../typer/inntekt'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'

const YtelserNAV = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const harSoektYtelse = watch('ytelserNAV.svar')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <RHFSpoersmaalRadio name={'ytelserNAV.svar'} legend={t('inntektenDin.ytelserNAV.svar')} />
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
            <HvorforSpoerVi title="inntektenDin.ytelserNAV.svar">
                {t('inntektenDin.ytelserNAV.hvorfor')}
            </HvorforSpoerVi>
        </SkjemaGruppe>
    )
}

export default YtelserNAV
