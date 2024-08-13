import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { IInntektsjustering } from './types.ts'
import { BodyShort, Button, Heading, Label, Skeleton, VStack } from '@navikt/ds-react'

export const Inntektsjustering = (): ReactNode => {
    const { data, isLoading, error }: SWRResponse<IInntektsjustering, boolean, boolean> =
        useSWR(`/api/inntektsjustering`)
    const navigate = useNavigate()

    return isLoading ? (
        <Skeleton />
    ) : !!data && !error ? (
        <VStack gap="4" justify="center">
            <Heading size={'medium'}>Tidligere oppgitt inntekt</Heading>
            <Heading size={'small'}>Inntekt for neste år 2025</Heading>
            <Label>Forventet brutto inntekt i Norge for 2025</Label>
            <BodyShort>{data.arbeidsinntekt}</BodyShort>
            <Button onClick={() => navigate('/')}>Tilbake</Button>
        </VStack>
    ) : (
        <VStack gap="4" align="center">
            <Heading size="medium">Fant ingen inntektsjustering</Heading>
            <Button onClick={() => navigate('/inntektsjustering/opprett')}>Opprett inntektsjustering</Button>
        </VStack>
    )
}
