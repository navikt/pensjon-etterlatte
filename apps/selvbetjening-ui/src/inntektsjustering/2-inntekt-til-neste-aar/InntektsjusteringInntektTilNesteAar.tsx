import { Accordion, Box, Heading, HStack, TextField, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Navigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { EqualsIcon } from '@navikt/aksel-icons'

// TODO: datastrukturen her må sees mer nøye på
interface InntektTilNesteAarSkjema {
    arbeidsinntektINorge: number
    naeringsinntekt: number
    AFPInntekt: number
    alleInntekterIUtland: number
}

const inntektTilNesteAarDefaultValues: InntektTilNesteAarSkjema = {
    arbeidsinntektINorge: 0,
    naeringsinntekt: 0,
    AFPInntekt: 0,
    alleInntekterIUtland: 0,
}

export const InntektsjusteringInntektTilNesteAar = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    const { register, watch, setValue } = useForm<InntektTilNesteAarSkjema>({
        defaultValues: inntektTilNesteAarDefaultValues,
    })

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    // Fra skatteetaten: gir feil hvis man ikke har gitt et tall, man må aktivt sette det til "0"
    //                   de har blokkert muligheten for å kunne skrive inn bokstaver
    //                   lar deg heller ikke skrive minus beløp

    /* TODO: Sjekke for: ingen input, ikke tall input, negativ input */
    // const validerTallInput = (value: number | undefined): string | undefined => {
    //     console.log(value)
    //     if (!(value >= 0)) return 'Inntekt må være større enn 0'
    //     return undefined
    // }

    return (
        !!innhold && (
            <HStack justify="center" padding="8">
                <VStack gap="6" maxWidth="42.5rem">
                    <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" />

                    <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />

                    <div>
                        <Heading size="small" level="4" spacing>
                            {innhold.inntektAccordions?.tittel?.[spraak]}
                        </Heading>
                        <Accordion>
                            <Accordion.Item>
                                <Accordion.Header>
                                    {innhold.inntektAccordions?.arbeidsinntekt?.tittel?.[spraak]}
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SanityRikTekst
                                        text={innhold.inntektAccordions?.arbeidsinntekt?.innhold?.[spraak]}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    {innhold.inntektAccordions?.naeringsinntekt?.tittel?.[spraak]}
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SanityRikTekst
                                        text={innhold.inntektAccordions?.naeringsinntekt?.innhold?.[spraak]}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    {innhold.inntektAccordions?.AFPInntekt?.tittel?.[spraak]}
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SanityRikTekst text={innhold.inntektAccordions?.AFPInntekt?.innhold?.[spraak]} />
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    {innhold.inntektAccordions?.alleInntekterIUtland?.tittel?.[spraak]}
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SanityRikTekst
                                        text={innhold.inntektAccordions?.alleInntekterIUtland?.innhold?.[spraak]}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <form>
                        <VStack gap="6" width="fit-content">
                            <TextField
                                {...register('arbeidsinntektINorge', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        setValue('arbeidsinntektINorge', e.target.value.replace(/[^0-9.]/g, ''))
                                    },
                                })}
                                label={innhold.inntektTextFields?.arbeidsinntekt?.label?.[spraak]}
                                description={innhold.inntektTextFields?.arbeidsinntekt?.beskrivelse?.[spraak]}
                                inputMode="numeric"
                            />
                            <TextField
                                {...register('naeringsinntekt', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        setValue('naeringsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                                    },
                                })}
                                label={innhold.inntektTextFields?.naeringsinntekt?.label?.[spraak]}
                                description={innhold.inntektTextFields?.naeringsinntekt?.beskrivelse?.[spraak]}
                                inputMode="numeric"
                            />
                            <TextField
                                {...register('AFPInntekt', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        setValue('AFPInntekt', e.target.value.replace(/[^0-9.]/g, ''))
                                    },
                                })}
                                label={innhold.inntektTextFields?.AFPInntekt?.label?.[spraak]}
                                description={innhold.inntektTextFields?.AFPInntekt?.beskrivelse?.[spraak]}
                                inputMode="numeric"
                            />
                            <TextField
                                {...register('alleInntekterIUtland', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        setValue('alleInntekterIUtland', e.target.value.replace(/[^0-9.]/g, ''))
                                    },
                                })}
                                label={innhold.inntektTextFields?.alleInntekterIUtland?.label?.[spraak]}
                                description={innhold.inntektTextFields?.alleInntekterIUtland?.beskrivelse?.[spraak]}
                                inputMode="numeric"
                            />
                        </VStack>
                    </form>

                    <Box background="surface-subtle" padding="4" borderRadius="xlarge">
                        <VStack gap="4">
                            <EqualsIcon fontSize="3.5rem" aria-hidden />
                            <Heading size="small">{innhold.sumAvInntekt?.[spraak]}</Heading>
                            {/* Hvis input er NaN, bare gjøre det om til 0*/}
                            <Heading size="large">
                                {watch().arbeidsinntektINorge +
                                    watch().naeringsinntekt +
                                    watch().AFPInntekt +
                                    watch().alleInntekterIUtland}{' '}
                                kr
                            </Heading>
                        </VStack>
                    </Box>

                    <NavigasjonMeny tilbakePath="/innledning" nestePath="/oppsummering" />
                </VStack>
            </HStack>
        )
    )
}
