import { Button, Checkbox, CheckboxGroup, HStack, TextField, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { IOpprettInntektsjustering } from '../types/inntektsjustering.ts'
import useSWRMutation from 'swr/mutation'
import { poster } from '../utils/api.ts'

interface IOpprettInntektsjusteringSkjema {
    harArbeidsinntekt: boolean
    harNaeringsinntekt: boolean
    harInntektINorge: boolean
    harInntektIUtlandet: boolean
    arbeidsinntekt: number
    arbeidsinntektUtland: number
    naeringsinntekt: number
    naeringsinntektUtland: number
}

export const OpprettInntektsjustering = () => {
    const navigate = useNavigate()

    const { trigger } = useSWRMutation('/selvbetjening/api/inntektsjustering', poster)
    const { register, watch, handleSubmit } = useForm<IOpprettInntektsjusteringSkjema>()

    const opprettInntektsjustering = async (data: IOpprettInntektsjusteringSkjema) => {
        const inntektsjustering: IOpprettInntektsjustering = {
            arbeidsinntekt: data.arbeidsinntekt ?? 0,
            arbeidsinntektUtland: data.arbeidsinntektUtland ?? 0,
            naeringsinntekt: data.naeringsinntekt ?? 0,
            naeringsinntektUtland: data.naeringsinntektUtland ?? 0,
        }
        await trigger(inntektsjustering)
        navigate('/inntektsjustering/kvittering', { state: { inntektsjustering } })
    }

    return (
        <form onSubmit={handleSubmit(opprettInntektsjustering)}>
            <VStack gap="4" align="center" paddingBlock="4">
                <CheckboxGroup legend="Hvilken type inntekt har du?">
                    <Checkbox {...register('harArbeidsinntekt')}>Arbeidsinntekt</Checkbox>
                    <Checkbox {...register('harNaeringsinntekt')}>Næringsinntekt</Checkbox>
                </CheckboxGroup>
                <CheckboxGroup legend="Hvor har du arbeidsinntekt fra?">
                    <Checkbox {...register('harInntektINorge')}>Norge</Checkbox>
                    <Checkbox {...register('harInntektIUtlandet')}>Utland</Checkbox>
                </CheckboxGroup>
                {watch().harArbeidsinntekt && watch().harInntektINorge && (
                    <TextField
                        {...register('arbeidsinntekt', { valueAsNumber: true })}
                        label="Oppgi forventet arbeidsinntekt fra januar til og med desember"
                        description="Inntekten du oppgir, skal være brutto inntekt, altså inntekt før skatt."
                    />
                )}
                {watch().harArbeidsinntekt && watch().harInntektIUtlandet && (
                    <TextField
                        {...register('arbeidsinntektUtland', { valueAsNumber: true })}
                        label="Oppgi forventet arbeidsinntekt fra januar til og med desember"
                        description="Inntekten du oppgir, skal være brutto inntekt, altså inntekt før skatt."
                    />
                )}
                {watch().harNaeringsinntekt && watch().harInntektINorge && (
                    <TextField
                        {...register('naeringsinntekt', { valueAsNumber: true })}
                        label="Oppgi forventet arbeidsinntekt fra januar til og med desember"
                        description="Inntekten du oppgir, skal være brutto inntekt, altså inntekt før skatt."
                    />
                )}
                {watch().harNaeringsinntekt && watch().harInntektIUtlandet && (
                    <TextField
                        {...register('naeringsinntektUtland', { valueAsNumber: true })}
                        label="Oppgi forventet arbeidsinntekt fra januar til og med desember"
                        description="Inntekten du oppgir, skal være brutto inntekt, altså inntekt før skatt."
                    />
                )}
                <HStack gap="4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/inntektsjustering')}>
                        Tilbake
                    </Button>
                    <Button type="submit">Opprett</Button>
                </HStack>
            </VStack>
        </form>
    )
}
