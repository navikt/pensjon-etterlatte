import { useInntekt } from '../../../common/inntekt/InntektContext.tsx'
import { useForm } from 'react-hook-form'
import { Inntekt } from '../../../types/inntektsjustering.ts'
import { ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'

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

    const { register, setValue } = useForm<Inntekt>({ defaultValues: inntekt })

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
                </VStack>
            </form>
        )
    )
}
