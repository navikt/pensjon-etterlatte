import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { IkkeGyldigForAaMeldeInnInntekt } from '../../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { Button, HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../../common/spraak/SpraakVelger.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const IkkeGyldigAlder = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<IkkeGyldigForAaMeldeInnInntekt>('*[_type == "ikkeGyldigForAaMeldeInnInntekt"]')

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
                    </VStack>
                    <div>
                        <SanityRikTekst text={innhold.ikkeGyldigAlder?.innhold?.[spraak]} />
                    </div>
                    <div>
                        <Button
                            as="a"
                            variant="primary"
                            icon={<ArrowRightIcon aria-hidden />}
                            iconPosition="right"
                            rel="noopener noreferrer"
                            href={innhold.ikkeGyldigAlder?.gaaTilNAVKnapp?.lenke?.[spraak]}
                        >
                            {innhold.ikkeGyldigAlder?.gaaTilNAVKnapp?.tekst?.[spraak]}
                        </Button>
                    </div>
                </HStack>
            </main>
        )
    )
}
