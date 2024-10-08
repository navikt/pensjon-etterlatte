import { useInntekt } from '../../../common/inntekt/InntektContext.tsx'
import { useForm } from 'react-hook-form'
import { Inntekt } from '../../../types/inntektsjustering.ts'
import { ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'

export const FemtiSyvTilSekstiAarSkjema = () => {
    const spraak = useSpraak()

    const inntekt = useInntekt()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    const { register, setValue, watch, getValues } = useForm<Inntekt>({ defaultValues: inntekt })

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <form>
                <VStack gap="6" width="fit-content">
                    <VStack gap="2">
                        <TextField
                            {...register('arbeidsinntekt', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('arbeidsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.arbeidsinntekt?.description?.[
                                    spraak
                                ]
                            }
                            inputMode="numeric"
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
                        <TextField
                            {...register('naeringsinntekt', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('naeringsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.naeringsinntekt?.description?.[
                                    spraak
                                ]
                            }
                            inputMode="numeric"
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

                    <TextField
                        {...register('AFPInntekt', {
                            valueAsNumber: true,
                            onChange: (e) => {
                                setValue('AFPInntekt', e.target.value.replace(/[^0-9.]/g, ''))
                            },
                        })}
                        label={innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPInntekt?.label?.[spraak]}
                        description={
                            innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPInntekt?.description?.[spraak]
                        }
                    />

                    {!!watch().AFPInntekt && (
                        <TextField
                            {...register('AFPTjenesteordning')}
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPTjenestepensjonordning
                                    ?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.AFPTjenestepensjonordning
                                    ?.description?.[spraak]
                            }
                        />
                    )}

                    <VStack gap="2">
                        <TextField
                            {...register('inntektFraUtland', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('inntektFraUtland', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.label?.[spraak]
                            }
                            description={
                                innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema?.inntektFraUtland?.description?.[
                                    spraak
                                ]
                            }
                            inputMode="numeric"
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

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} />

                    <NavigasjonMeny tilbakePath="/innledning" nestePath="/oppsummering" inntekt={getValues()} />
                </VStack>
            </form>
        )
    )
}
