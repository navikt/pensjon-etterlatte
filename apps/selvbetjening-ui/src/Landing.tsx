import { Button, Heading, VStack } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import SanityTest from "./components/SanityTest.tsx";

export const Landing = () => {
    const navigate = useNavigate()

    return (
        <VStack gap="4" align="center">
            <Heading size="xlarge">Velkommen til selvbetjening!</Heading>
            <SanityTest />
            <div>
                <Button onClick={() => navigate('/inntektsjustering')}>Til inntektsjustering</Button>
            </div>
        </VStack>
    )
}
