import { TextField, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { Inntekt } from '../../../types/inntektsjustering.ts'

const inntektDefaultValues: Inntekt = {
    arbeidsinntekt: 0,
    naeringsinntekt: 0,
    inntektFraUtland: 0,
}

export const AttenTilFemtiSeksAarSkjema = () => {
    const { register, setValue, watch } = useForm<Inntekt>({ defaultValues: inntektDefaultValues })

    return (
        <form>
            <VStack gap="6" width="fit-content">
                <TextField
                    {...register('arbeidsinntekt', {
                        valueAsNumber: true,
                        onChange: (e) => {
                            setValue('arbeidsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                        },
                    })}
                    label="Arbeidsinntekt og andre utbetalinger"
                    inputMode="numeric"
                />
                <TextField
                    {...register('naeringsinntekt', {
                        valueAsNumber: true,
                        onChange: (e) => {
                            setValue('naeringsinntekt', e.target.value.replace(/[^0-9.]/g, ''))
                        },
                    })}
                    label="Næringsinntekt"
                    inputMode="numeric"
                />
                <TextField
                    {...register('inntektFraUtland', {
                        valueAsNumber: true,
                        onChange: (e) => {
                            setValue('inntektFraUtland', e.target.value.replace(/[^0-9.]/g, ''))
                        },
                    })}
                    label="Alle inntekter fra utland"
                    inputMode="numeric"
                />

                <SumAvOppgittInntekt inntektTilNesteAar={watch()} />

                <NavigasjonMeny tilbakePath="/innledning" nestePath="/oppsummering" />
            </VStack>
        </form>
    )
}
