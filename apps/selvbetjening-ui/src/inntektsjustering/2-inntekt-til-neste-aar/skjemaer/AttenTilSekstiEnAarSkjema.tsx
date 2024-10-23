import { Loader, ReadMore, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { Inntekt } from '../../../types/inntektsjustering.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { useInntekt, useInntektDispatch } from '../../../common/inntekt/InntektContext.tsx'
import { ControlledInntektTextField } from '../../../common/inntekt/ControlledInntektTextField.tsx'
import { Alder } from '../../../types/person.ts'

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

    const { control, watch, handleSubmit } = useForm<Inntekt>({
        defaultValues: inntekt,
    })

    if (innholdIsLoading) {
        return <Loader />
    }
    if (innholdError) {
        return <Navigate to="/system-utilgjengelig" />
    }
    if (!innhold?.inntektSkjemaer?.attenTilFemtiSeksAar) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const onInntektSubmit = (inntekt: Inntekt) => {
        inntektDispatch.setInntekt(inntekt)
        navigate(`/oppsummering`)
    }

    const { hovedinnhold, arbeidsinntekt, naeringsinntekt, inntektFraUtland, sumAvInntekt } =
        innhold.inntektSkjemaer.attenTilFemtiSeksAar

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
                            label={inntektFraUtland?.label?.[spraak]}
                            description={inntektFraUtland?.description?.[spraak]}
                        />
                        {!!inntektFraUtland?.readMore && (
                            <ReadMore header={inntektFraUtland?.readMore?.tittel?.[spraak]}>
                                <SanityRikTekst text={inntektFraUtland?.readMore?.innhold?.[spraak]} />
                            </ReadMore>
                        )}
                    </VStack>

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} alder={Alder.ATTEN_TIL_SEKSTI_EN}>
                        <SanityRikTekst text={sumAvInntekt?.[spraak]} />
                    </SumAvOppgittInntekt>

                    <NavigasjonMeny tilbakePath="/innledning" onNeste={handleSubmit(onInntektSubmit)} />
                </VStack>
            </form>
        )
    )
}
