import { ReactNode } from 'react'
import { Heading, HStack, LinkPanel, VStack } from '@navikt/ds-react'
import { InformasjonOmInnloggetBruker } from './components/InformasjonOmInnloggetBruker.tsx'

export const Inntektsjustering = (): ReactNode => {
    return (
        <HStack justify="center">
            <VStack gap="8" align="start" paddingBlock="8" paddingInline="4">
                <InformasjonOmInnloggetBruker />
                <LinkPanel href={`${import.meta.env.BASE_URL}/inntektsjustering/opprett`} border>
                    <Heading size="small">Legg inn inntekt til neste år</Heading>
                </LinkPanel>
            </VStack>
        </HStack>
    )
}
