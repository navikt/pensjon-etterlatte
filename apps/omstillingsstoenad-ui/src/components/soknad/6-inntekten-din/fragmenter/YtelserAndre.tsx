import { Box, Heading, ReadMore, VStack } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import { IInntekt, SoekbareYtelserAndre } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const YtelserAndre = () => {
    const { t } = useTranslation()

    const omsSoeknadNyttInntektStegFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_SOEKNAD_NYTT_INNTEKT_STEG)

    const { watch } = useFormContext<IInntekt>()

    const harSoektYtelse = watch('ytelserAndre.svar')
    const soekteYtelser = watch('ytelserAndre.soekteYtelser')

    return (
        <Box marginBlock="0 12">
            <Heading size={'small'}>{t('inntektenDin.ytelserAndre.tittel')}</Heading>
            <VStack marginBlock="4 0">
                <RHFSpoersmaalRadio
                    name={'ytelserAndre.svar'}
                    legend={t('inntektenDin.ytelserAndre.svar')}
                    description={t('inntektenDin.ytelserAndre.hvorfor')}
                />
                {omsSoeknadNyttInntektStegFeatureToggle.status === FeatureToggleStatus.PAA && (
                    <ReadMore header={t('inntektenDin.ytelserAndre.hvorforViSpoer.tittel')}>
                        {t('inntektenDin.ytelserAndre.hvorforViSpoer.innhold')}
                    </ReadMore>
                )}
            </VStack>
            {harSoektYtelse === IValg.JA && (
                <Box marginBlock="4">
                    <RHFCheckboksGruppe
                        name={'ytelserAndre.soekteYtelser'}
                        legend={t('inntektenDin.ytelserAndre.soekteYtelser')}
                        checkboxes={Object.values(SoekbareYtelserAndre).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </Box>
            )}
            {soekteYtelser && !!soekteYtelser.length && (
                <>
                    <Box marginBlock="4">
                        <RHFInputArea
                            name={'ytelserAndre.pensjonsordning'}
                            label={t('inntektenDin.ytelserAndre.pensjonsordning')}
                            description={t('inntektenDin.ytelserAndre.pensjonsordning.beskrivelse')}
                            maxLength={200}
                            className={'width-50'}
                            resize={'vertical'}
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}

export default YtelserAndre
