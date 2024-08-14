import { ReactNode } from 'react'
import { HStack, VStack } from '@navikt/ds-react'
import { InformasjonOmInnloggetBruker } from './components/InformasjonOmInnloggetBruker.tsx'
import { SisteInnsendteInntektsjustering } from './components/SisteInnsendteInntektsjustering.tsx'

export const Inntektsjustering = (): ReactNode => {
    return (
        <HStack justify="center">
            <VStack gap="8" align="start" paddingBlock="8 0" paddingInline="4">
                <InformasjonOmInnloggetBruker />
                <SisteInnsendteInntektsjustering />
            </VStack>
        </HStack>
    )
}
