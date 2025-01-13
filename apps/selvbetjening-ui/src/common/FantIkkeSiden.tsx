import { HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from './spraakVelger/SpraakVelger.tsx'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { FantIkkeSiden as FantIkkeSidenInnhold } from './sanity.types.ts'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'
import { SideLaster } from './SideLaster.tsx'

export const FantIkkeSiden = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<FantIkkeSidenInnhold>('*[_type == "fantIkkeSiden"]')

    if (isLoading) {
        return <SideLaster />
    }
    if (error) {
        throw error
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
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
    )
}
