import { Button, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { SideLaster } from './SideLaster.tsx'
import { IkkeGyldigForAaMeldeInnInntekt } from '../sanity.types.ts'

export const IkkeGyldigAlder = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<IkkeGyldigForAaMeldeInnInntekt>('*[_type == "ikkeGyldigForAaMeldeInntektTestBlocks"]')

    if (innholdIsLoading) {
        return <SideLaster />
    }

    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <VStack gap="6">
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
            </VStack>
        )
    )
}
