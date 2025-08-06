import { ReadMore, VStack } from '@navikt/ds-react'
import { addYears, startOfYear } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Maanedvelger } from '~components/felles/Maanedvelger'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'
import { erMellomOktoberogDesember } from '~utils/dato'

export const SkalGaaAvMedAlderspensjon = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const skalGaAavMedAlderspensjon = watch('skalGaaAvMedAlderspensjon')

    return (
        <VStack gap="4">
            <VStack gap="2">
                <RHFSpoersmaalRadio
                    name={'skalGaaAvMedAlderspensjon.valg'}
                    legend={
                        erMellomOktoberogDesember()
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
                        erMellomOktoberogDesember()
                            ? new Date(addYears(new Date(startOfYear(new Date())), 1))
                            : new Date(startOfYear(new Date()))
                    }
                />
            )}
        </VStack>
    )
}
