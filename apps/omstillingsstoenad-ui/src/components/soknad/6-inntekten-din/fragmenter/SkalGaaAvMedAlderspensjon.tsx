import { ReadMore, VStack } from '@navikt/ds-react'
import { addYears, startOfYear } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Maanedvelger } from '~components/felles/Maanedvelger'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import { IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'
import { erMellomOktoberogDesember } from '~utils/dato'

export const SkalGaaAvMedAlderspensjon = () => {
    const omsSoeknadNyttInntektStegFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_SOEKNAD_NYTT_INNTEKT_STEG)

    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const skalGaAavMedAlderspensjon = watch('skalGaaAvMedAlderspensjon')

    const visTekstForAlderspensjonNesteAar = (): boolean => {
        if (omsSoeknadNyttInntektStegFeatureToggle.status === FeatureToggleStatus.PAA) {
            return true
        } else return erMellomOktoberogDesember()
    }

    return (
        <VStack gap="4">
            <VStack gap="2">
                <RHFSpoersmaalRadio
                    name={'skalGaaAvMedAlderspensjon.valg'}
                    legend={
                        visTekstForAlderspensjonNesteAar()
                            ? t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektTilNesteAar')
                            : t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar')
                    }
                    vetIkke
                />
                <ReadMore header={t('inntektenDin.skalGaaAvMedAlderspensjon.naarKanJegTaUtAlderspensjon.tittel')}>
                    {t('inntektenDin.skalGaaAvMedAlderspensjon.naarKanJegTaUtAlderspensjon.innhold')}
                </ReadMore>
            </VStack>

            {skalGaAavMedAlderspensjon?.valg === IValg.JA && (
                <Maanedvelger
                    name={'skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'}
                    label={t('inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon')}
                    fromDate={
                        visTekstForAlderspensjonNesteAar()
                            ? new Date(addYears(new Date(startOfYear(new Date())), 1))
                            : new Date(startOfYear(new Date()))
                    }
                />
            )}
        </VStack>
    )
}
