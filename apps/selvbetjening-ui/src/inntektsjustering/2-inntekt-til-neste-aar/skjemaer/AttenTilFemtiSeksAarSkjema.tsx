import { ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { Inntekt } from '../../../types/inntektsjustering.ts'
import { Navigate } from 'react-router-dom'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { useInntekt } from '../../../common/inntekt/InntektContext.tsx'

export const AttenTilFemtiSeksAarSkjema = () => {
    const spraak = useSpraak()

    const inntekt = useInntekt()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    const { register, setValue, watch, getValues } = useForm<Inntekt>({
        defaultValues: inntekt,
    })

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
                            label={innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.label?.[spraak]}
                            description={
                                innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.arbeidsinntekt?.description?.[spraak]
                            }
                            inputMode="numeric"
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
                        <TextField
                            {...register('naeringsinntekt', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('naeringsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.label?.[spraak]}
                            description={
                                innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.naeringsinntekt?.description?.[spraak]
                            }
                            inputMode="numeric"
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
                        <TextField
                            {...register('inntektFraUtland', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('inntektFraUtland', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.label?.[spraak]}
                            description={
                                innhold?.inntektSkjemaer?.attenTilFemtiSeksAar?.inntektFraUtland?.description?.[spraak]
                            }
                            inputMode="numeric"
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

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} />

                    <NavigasjonMeny tilbakePath="/innledning" nestePath="/oppsummering" inntekt={getValues()} />
                </VStack>
            </form>
        )
    )
}
