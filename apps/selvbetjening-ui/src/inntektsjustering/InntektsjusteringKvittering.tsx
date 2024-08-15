import { useLocation, useNavigate } from 'react-router-dom'
import { IInntektsjustering } from '../types/inntektsjustering.ts'
import { BodyShort, Button, Heading, Label, VStack } from '@navikt/ds-react'

export const InntektsjusteringKvittering = () => {
    const navigate = useNavigate()

    const { inntektsjustering }: { inntektsjustering: IInntektsjustering } = useLocation().state ?? {}

    return inntektsjustering ? (
        <VStack gap="4" align="center">
            <div>
                <Label>Arbeidsinntekt i Norge</Label>
                <BodyShort>{inntektsjustering.arbeidsinntekt}</BodyShort>
            </div>
            <div>
                <Label>Arbeidsinntekt i utlandet</Label>
                <BodyShort>{inntektsjustering.arbeidsinntektUtland}</BodyShort>
            </div>
        </VStack>
    ) : (
        <VStack gap="4" align="center">
            <Heading size="medium">Ingen inntektsjustering registrert</Heading>
            <Button onClick={() => navigate('/inntektsjustering/opprett')}>Til opprettelse av inntektsjustering</Button>
        </VStack>
    )
}
