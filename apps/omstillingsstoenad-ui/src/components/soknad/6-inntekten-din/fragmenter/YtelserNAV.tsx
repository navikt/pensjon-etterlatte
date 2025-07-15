import { Box, Heading, ReadMore, VStack } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import { IInntekt, SoekbareYtelserNAV } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const YtelserNAV = () => {
    const { t } = useTranslation()

    const omsSoeknadNyttInntektStegFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_SOEKNAD_NYTT_INNTEKT_STEG)

    const { watch } = useFormContext<IInntekt>()

    const harSoektYtelse = watch('ytelserNAV.svar')

    return (
        <Box marginBlock="0 12">
            <Heading size={'small'}>{t('inntektenDin.ytelserNAV.tittel')}</Heading>
            <VStack marginBlock="4 0">
                <RHFSpoersmaalRadio
                    name={'ytelserNAV.svar'}
                    legend={t('inntektenDin.ytelserNAV.svar')}
                    description={t('inntektenDin.ytelserNAV.hvorfor')}
                />
                {omsSoeknadNyttInntektStegFeatureToggle.status === FeatureToggleStatus.PAA && (
                    <ReadMore header={t('inntektenDin.ytelserNAV.hvorforViSpoer.tittel')}>
                        {t('inntektenDin.ytelserNAV.hvorforViSpoer.innhold')}
                    </ReadMore>
                )}
            </VStack>
            {harSoektYtelse === IValg.JA && (
                <Box marginBlock="4">
                    <RHFCheckboksGruppe
                        name={'ytelserNAV.soekteYtelser'}
                        legend={t('inntektenDin.ytelserNAV.soekteYtelser')}
                        checkboxes={Object.values(SoekbareYtelserNAV).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </Box>
            )}
        </Box>
    )
}

export default YtelserNAV
