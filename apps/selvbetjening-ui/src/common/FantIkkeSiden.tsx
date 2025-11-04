import { HStack, VStack } from '@navikt/ds-react'
import { SideLaster } from './SideLaster.tsx'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { FantIkkeSiden as FantIkkeSidenInnhold } from './sanity.types.ts'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { SpraakVelger } from './spraakVelger/SpraakVelger.tsx'

export const FantIkkeSiden = () => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } =
        useSanityInnhold<FantIkkeSidenInnhold>('*[_type == "fantIkkeSiden"]')

    if (innholdIsLoading) {
        return <SideLaster />
    }
    if (innholdError) {
        throw innholdError
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
