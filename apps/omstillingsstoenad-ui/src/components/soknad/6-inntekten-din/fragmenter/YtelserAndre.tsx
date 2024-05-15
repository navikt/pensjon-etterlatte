import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, SoekbareYtelserAndre } from '../../../../typer/inntekt'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'
import { Heading } from '@navikt/ds-react'

const YtelserAndre = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const harSoektYtelse = watch('ytelserAndre.svar')
    const soekteYtelser = watch('ytelserAndre.soekteYtelser')

    return (
        <SkjemaGruppe>
            <Heading size={'xsmall'}>{t('inntektenDin.ytelserAndre.tittel')}</Heading>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'ytelserAndre.svar'}
                    legend={t('inntektenDin.ytelserAndre.svar')}
                    description={t('inntektenDin.ytelserAndre.hvorfor')}
                />
            </SkjemaElement>
            {harSoektYtelse === IValg.JA && (
                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'ytelserAndre.soekteYtelser'}
                        legend={t('inntektenDin.ytelserAndre.soekteYtelser')}
                        checkboxes={Object.values(SoekbareYtelserAndre).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>
            )}
            {soekteYtelser && !!soekteYtelser.length && (
                <>
                    <SkjemaElement>
                        <RHFInputArea
                            name={'ytelserAndre.pensjonsordning'}
                            label={t('inntektenDin.ytelserAndre.pensjonsordning')}
                            description={t('inntektenDin.ytelserAndre.pensjonsordning.beskrivelse')}
                            maxLength={200}
                            className={'width-50'}
                            resize={'vertical'}
                        />
                    </SkjemaElement>
                </>
            )}
        </SkjemaGruppe>
    )
}

export default YtelserAndre
