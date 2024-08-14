import { ReactNode } from 'react'
import { VStack } from '@navikt/ds-react'
import { InformasjonOmInnloggetBruker } from './components/InformasjonOmInnloggetBruker.tsx'

export const Inntektsjustering = (): ReactNode => {
    return (
        <VStack gap="4" align="center" paddingBlock="8 0">
            <InformasjonOmInnloggetBruker />
        </VStack>
    )
}
