import { Accordion, Heading, HStack, TextField, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'

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
    const { register } = useForm<InntektTilNesteAarSkjema>({ defaultValues: inntektTilNesteAarDefaultValues })

    /* TODO: Sjekke for: 1) Ingen input. 2) ikke tall input, 3) negativ input */
    const validerTallInput = (value: number): string | undefined => {
        if (!(value >= 0)) return 'Inntekt må være større enn 0'
        return undefined
    }

    return (
        <HStack justify="center" padding="8">
            <VStack gap="6" maxWidth="42.rem">
                <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" />

                <div>sanity innhold</div>

                <div>
                    <Heading size="small" level="4" spacing>
                        Disse inntektene skal du melde inn
                    </Heading>
                    <Accordion>
                        <Accordion.Item>
                            <Accordion.Header>Arbeidsinntekt og andre utbetalinger</Accordion.Header>
                            <Accordion.Content>sanity innhold</Accordion.Content>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>Næringsinntekt</Accordion.Header>
                            <Accordion.Content>sanity innhold</Accordion.Content>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>Avtalefestet pensjon offentlig og privat (AFP)</Accordion.Header>
                            <Accordion.Content>sanity innhold</Accordion.Content>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>Alle inntekter fra utland</Accordion.Header>
                            <Accordion.Content>sanity innhold</Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <form>
                    <VStack gap="6" width="fit-content">
                        <TextField
                            {...register('arbeidsinntektINorge', {
                                valueAsNumber: true,
                                validate: validerTallInput,
                            })}
                            label="Arbeidsinntekter og andre utbetalinger i Norge"
                            description="Oppgi forventet årsinntekt fra januar til og med desember"
                            inputMode="numeric"
                        />
                        <TextField
                            {...register('naeringsinntekt', {
                                valueAsNumber: true,
                                validate: validerTallInput,
                            })}
                            label="Næringsinntekt"
                            description="Oppgi forventet årsinntekt fra januar til og med desember"
                            inputMode="numeric"
                        />
                        <TextField
                            {...register('AFPInntekt', {
                                valueAsNumber: true,
                                validate: validerTallInput,
                            })}
                            label="AFP offentlig eller privat"
                            description="Oppgi forventet årsinntekt fra januar til og med desember"
                            inputMode="numeric"
                        />
                        <TextField
                            {...register('alleInntekterIUtland', {
                                valueAsNumber: true,
                                validate: validerTallInput,
                            })}
                            label="Alle inntekter fra utland"
                            description="Oppgi forventet årsinntekt fra januar til og med desember"
                            inputMode="numeric"
                        />
                    </VStack>
                </form>

                <NavigasjonMeny tilbakePath="/innledning" nestePath="/oppsummering" />
            </VStack>
        </HStack>
    )
}
