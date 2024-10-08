import { useInntekt, useInntektDispatch } from '../../../common/inntekt/InntektContext.tsx'
import { useForm } from 'react-hook-form'
import { Inntekt } from '../../../types/inntektsjustering.ts'
import { ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { ControlledInntektTextField } from '../../../common/inntekt/ControlledInntektTextField.tsx'
import { Alder } from '../../../types/person.ts'

export const FemtiSyvTilSekstiAarSkjema = () => {
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

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inntekt>({ defaultValues: inntekt })

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
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.description?.[
                                    spraak
                                ]
                            }
                        />

                        {!!innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.readMore && (
                            <ReadMore
                                header={
                                    innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.readMore
                                        ?.tittel?.[spraak]
                                }
                            >
                                <SanityRikTekst
                                    text={
                                        innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.readMore
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
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.description?.[
                                    spraak
                                ]
                            }
                        />
                        {!!innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.readMore && (
                            <ReadMore
                                header={
                                    innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.readMore
                                        ?.tittel?.[spraak]
                                }
                            >
                                <SanityRikTekst
                                    text={
                                        innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.readMore
                                            ?.innhold?.[spraak]
                                    }
                                />
                            </ReadMore>
                        )}
                    </VStack>

                    <ControlledInntektTextField
                        name="AFPInntekt"
                        control={control}
                        label={innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPInntekt?.label?.[spraak]}
                        description={
                            innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPInntekt?.description?.[spraak]
                        }
                    />

                    {!!watch().AFPInntekt && (
                        <TextField
                            {...register('AFPTjenesteordning', {
                                required: {
                                    value: true,
                                    message:
                                        innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPTjenestepensjonordning
                                            ?.tomInputError?.[spraak] ?? 'Må settes',
                                },
                            })}
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPTjenestepensjonordning
                                    ?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPTjenestepensjonordning
                                    ?.description?.[spraak]
                            }
                            error={errors.AFPTjenesteordning?.message}
                        />
                    )}

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name="inntektFraUtland"
                            control={control}
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.description?.[
                                    spraak
                                ]
                            }
                        />

                        {!!innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.readMore && (
                            <ReadMore
                                header={
                                    innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.readMore
                                        ?.tittel?.[spraak]
                                }
                            >
                                <SanityRikTekst
                                    text={
                                        innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.readMore
                                            ?.innhold?.[spraak]
                                    }
                                />
                            </ReadMore>
                        )}
                    </VStack>

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} alder={Alder.FEMTI_SYV_TIL_SEKSTI_EN} />

                    <NavigasjonMeny tilbakePath="/innledning" onNeste={handleSubmit(onInntektSubmit)} />
                </VStack>
            </form>
        )
    )
}
