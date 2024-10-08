import { ReadMore, VStack } from '@navikt/ds-react'
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

export const AttenTilFemtiSeksAarSkjema = () => {
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

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const onInntektSubmit = (inntekt: Inntekt) => {
        inntektDispatch.setInntekt(inntekt)
        navigate(`/inntektsjustering/oppsummering`)
    }

    return (
        !!innhold && (
            <form>
                <VStack gap="6" width="fit-content">
                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="arbeidsinntekt"
                            control={control}
                            label={innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.label?.[spraak]}
                            description={
                                innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.description?.[spraak]
                            }
                        />
                        {!!innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.readMore && (
                            <ReadMore
                                header={
                                    innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.readMore?.tittel?.[
                                        spraak
                                    ]
                                }
                            >
                                <SanityRikTekst
                                    text={
                                        innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.readMore
                                            ?.innhold?.[spraak]
                                    }
                                />
                            </ReadMore>
                        )}
                    </VStack>
                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="naeringsinntekt"
                            control={control}
                            label={innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.label?.[spraak]}
                            description={
                                innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.description?.[spraak]
                            }
                        />
                        {!!innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.readMore && (
                            <ReadMore
                                header={
                                    innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.readMore?.tittel?.[
                                        spraak
                                    ]
                                }
                            >
                                <SanityRikTekst
                                    text={
                                        innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.readMore
                                            ?.innhold?.[spraak]
                                    }
                                />
                            </ReadMore>
                        )}
                    </VStack>
                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="inntektFraUtland"
                            control={control}
                            label={innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.label?.[spraak]}
                            description={
                                innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.description?.[spraak]
                            }
                        />
                        {!!innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.readMore && (
                            <ReadMore
                                header={
                                    innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.readMore
                                        ?.tittel?.[spraak]
                                }
                            >
                                <SanityRikTekst
                                    text={
                                        innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.readMore
                                            ?.innhold?.[spraak]
                                    }
                                />
                            </ReadMore>
                        )}
                    </VStack>

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} alder={Alder.ATTEN_TIL_FEMTI_SEKS} />

                    <NavigasjonMeny tilbakePath="/innledning" onNeste={handleSubmit(onInntektSubmit)} />
                </VStack>
            </form>
        )
    )
}
