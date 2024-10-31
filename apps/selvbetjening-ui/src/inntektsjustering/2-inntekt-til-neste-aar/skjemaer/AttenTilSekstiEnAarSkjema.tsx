import { ReadMore, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { Inntekt, InntektSkjema } from '../../../types/inntektsjustering.ts'
import { useNavigate } from 'react-router-dom'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { useInntekt, useInntektDispatch } from '../../../common/inntekt/InntektContext.tsx'
import { ControlledInntektTextField } from '../../../common/inntekt/ControlledInntektTextField.tsx'
import { Alder } from '../../../types/person.ts'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { inntektSkjemaValuesTilInntekt, inntektTilInntektSkjemaValues } from '../../../utils/inntekt.ts'

export const AttenTilSekstiEnAarSkjema = () => {
    const spraak = useSpraak()

    const inntekt = useInntekt()
    const inntektDispatch = useInntektDispatch()

    const navigate = useNavigate()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    const { control, watch, handleSubmit } = useForm<InntektSkjema>({
        defaultValues: inntektTilInntektSkjemaValues(inntekt, spraak),
    })

    if (innholdIsLoading) {
        return <SideLaster />
    }
    if (innholdError) {
        throw innholdError
    }

    if (!innhold?.inntektSkjemaer?.attenTilSekstiEnAarSkjema) {
        throw Error('Finner ikke sanity innhold for skjema 18-61 år')
    }

    const onInntektSubmit = (inntekt: Inntekt) => {
        inntektDispatch.setInntekt(inntekt)
        navigate(`/oppsummering`)
    }

    const { hovedinnhold, arbeidsinntekt, naeringsinntekt, inntektFraUtland, sumAvInntekt } =
        innhold.inntektSkjemaer.attenTilSekstiEnAarSkjema

    return (
        !!innhold && (
            <form>
                <VStack gap="6" width="fit-content">
                    <div>
                        <SanityRikTekst text={hovedinnhold?.[spraak]} />
                    </div>

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="arbeidsinntekt"
                            control={control}
                            spraak={spraak}
                            label={arbeidsinntekt?.label?.[spraak]}
                            description={arbeidsinntekt?.description?.[spraak]}
                        />
                        {!!arbeidsinntekt?.readMore && (
                            <ReadMore header={arbeidsinntekt?.readMore?.tittel?.[spraak]}>
                                <SanityRikTekst text={arbeidsinntekt?.readMore?.innhold?.[spraak]} />
                            </ReadMore>
                        )}
                    </VStack>
                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="naeringsinntekt"
                            control={control}
                            spraak={spraak}
                            label={naeringsinntekt?.label?.[spraak]}
                            description={naeringsinntekt?.description?.[spraak]}
                        />
                        {!!naeringsinntekt?.readMore && (
                            <ReadMore header={naeringsinntekt?.readMore?.tittel?.[spraak]}>
                                <SanityRikTekst text={naeringsinntekt?.readMore?.innhold?.[spraak]} />
                            </ReadMore>
                        )}
                    </VStack>
                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="inntektFraUtland"
                            control={control}
                            spraak={spraak}
                            label={inntektFraUtland?.label?.[spraak]}
                            description={inntektFraUtland?.description?.[spraak]}
                        />
                        {!!inntektFraUtland?.readMore && (
                            <ReadMore header={inntektFraUtland?.readMore?.tittel?.[spraak]}>
                                <SanityRikTekst text={inntektFraUtland?.readMore?.innhold?.[spraak]} />
                            </ReadMore>
                        )}
                    </VStack>

                    <SumAvOppgittInntekt
                        inntektTilNesteAar={inntektSkjemaValuesTilInntekt(watch())}
                        alder={Alder.ATTEN_TIL_SEKSTI_EN}
                    >
                        <SanityRikTekst text={sumAvInntekt?.[spraak]} />
                    </SumAvOppgittInntekt>

                    <NavigasjonMeny
                        tilbakePath="/innledning"
                        onNeste={handleSubmit((inntekt) => onInntektSubmit(inntektSkjemaValuesTilInntekt(inntekt)))}
                    />
                </VStack>
            </form>
        )
    )
}
