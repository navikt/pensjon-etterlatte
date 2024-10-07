import { ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { Inntekt } from '../../../types/inntektsjustering.ts'
import { Navigate, useLocation } from 'react-router-dom'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'

const inntektDefaultValues: Inntekt = {
    arbeidsinntekt: 0,
    naeringsinntekt: 0,
    inntektFraUtland: 0,
}

export const AttenTilFemtiSeksAarSkjema = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const { state: inntekt } = useLocation() as Inntekt

    const { register, setValue, watch, getValues } = useForm<Inntekt>({
        defaultValues: inntekt ? inntekt : inntektDefaultValues,
    })

    const { arbeidsinntekt, naeringsinntekt, inntektFraUtland } = innhold?.inntektSkjemaer?.attenTilFemtiSeksAar

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
                            label={arbeidsinntekt?.label?.[spraak]}
                            description={arbeidsinntekt?.description?.[spraak]}
                            inputMode="numeric"
                        />
                        <ReadMore header={arbeidsinntekt?.readMore?.tittel?.[spraak]}>
                            <SanityRikTekst text={arbeidsinntekt?.readMore?.innhold?.[spraak]} />
                        </ReadMore>
                    </VStack>
                    <VStack gap="2">
                        <TextField
                            {...register('naeringsinntekt', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('naeringsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={naeringsinntekt?.label?.[spraak]}
                            description={naeringsinntekt?.description?.[spraak]}
                            inputMode="numeric"
                        />
                        <ReadMore header={naeringsinntekt?.readMore?.tittel?.[spraak]}>
                            <SanityRikTekst text={naeringsinntekt?.readMore?.innhold?.[spraak]} />
                        </ReadMore>
                    </VStack>
                    <VStack gap="2">
                        <TextField
                            {...register('inntektFraUtland', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    setValue('inntektFraUtland', e.target.value.replace(/[^0-9.]/g, ''))
                                },
                            })}
                            label={inntektFraUtland?.label?.[spraak]}
                            description={inntektFraUtland?.description?.[spraak]}
                            inputMode="numeric"
                        />
                        <ReadMore header={inntektFraUtland?.readMore?.tittel?.[spraak]}>
                            <SanityRikTekst text={inntektFraUtland?.readMore?.innhold?.[spraak]} />
                        </ReadMore>
                    </VStack>

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} />

                    <NavigasjonMeny tilbakePath="/innledning" nestePath="/oppsummering" inntekt={getValues()} />
                </VStack>
            </form>
        )
    )
}
