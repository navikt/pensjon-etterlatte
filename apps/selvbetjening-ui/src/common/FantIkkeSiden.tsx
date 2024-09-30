import { HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from './spraak/SpraakVelger.tsx'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { FantIkkeSiden as FantIkkeSidenInnhold } from '../sanity.types.ts'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { Navigate } from 'react-router-dom'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'

export const FantIkkeSiden = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<FantIkkeSidenInnhold>('*[_type == "fantIkkeSiden"]')

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        <main>
            <HStack justify="center" padding="8">
                <VStack gap="6" maxWidth="42.5rem">
                    <HStack justify="end">
                        <SpraakVelger />
                    </HStack>
                    <div>
                        <SanityRikTekst text={innhold?.hovedinnhold?.[spraak]} />
                    </div>
                </VStack>
            </HStack>
        </main>
    )
}
