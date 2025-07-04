import { ReadMore, VStack } from '@navikt/ds-react'
import { addYears } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { Maanedvelger } from '~components/felles/Maanedvelger'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import { IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'
import { erMellomOktoberogDesember } from '~utils/dato'

export const SkalGaaAvMedAlderspensjon = () => {
    const omsSoeknadNyttInntektStegFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_SOEKNAD_NYTT_INNTEKT_STEG)

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
                            ? 'Planlegger du å gå av med alderspensjon neste år?'
                            : 'Skal du gå av med alderspensjon å år?'
                    }
                    vetIkke
                />
                <ReadMore header={'Når kan jeg ta ut alderspensjon?'}>asdasd</ReadMore>
            </VStack>

            {skalGaAavMedAlderspensjon?.valg === IValg.JA && (
                <Maanedvelger
                    name={'skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'}
                    label={'Når planlegger du å gå av med alderspensjon?'}
                    fromDate={visTekstForAlderspensjonNesteAar() ? new Date(addYears(new Date(), 1)) : new Date()}
                />
            )}
        </VStack>
    )
}
