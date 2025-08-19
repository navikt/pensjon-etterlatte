import { ReadMore, VStack } from '@navikt/ds-react'
import { addYears, startOfYear } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Maanedvelger } from '~components/felles/Maanedvelger'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'
import { fyllerSekstiSyvIAar } from '~utils/alder'
import { erMellomOktoberogDesember } from '~utils/dato'

export const SkalGaaAvMedAlderspensjon = () => {
    const { t } = useTranslation()

    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const velgLegendTekstForSkalGaaAvMedAlderspensjon = (): string => {
        if (fyllerSekstiSyvIAar(bruker)) {
            return t('inntektenDin.skalGaaAvMedAlderspensjon.valg.fyllerSekstiSyvIAar')
        } else if (erMellomOktoberogDesember()) {
            return t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektTilNesteAar')
        } else {
            return t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar')
        }
    }

    const skalGaAavMedAlderspensjon = watch('skalGaaAvMedAlderspensjon')

    return (
        <VStack gap="4">
            <VStack gap="2">
                <RHFSpoersmaalRadio
                    name={'skalGaaAvMedAlderspensjon.valg'}
                    legend={velgLegendTekstForSkalGaaAvMedAlderspensjon()}
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
