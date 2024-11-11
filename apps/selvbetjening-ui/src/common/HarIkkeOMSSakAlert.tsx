import { Button, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'
import { IkkeGyldigForAaMeldeInnInntekt } from '../sanity.types.ts'
import { SideLaster } from './SideLaster.tsx'
import { SanityRikTekst } from './sanity/SanityRikTekst.tsx'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const HarIkkeOMSSakAlert = () => {
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
                    <SanityRikTekst text={innhold.harIkkeOMSSakIGjenny?.innhold?.[spraak]} />
                </div>
                <div>
                    <Button
                        as="a"
                        variant="primary"
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        rel="noopener noreferrer"
                        href={innhold.harIkkeOMSSakIGjenny?.gaaTilNAVKnapp?.lenke?.[spraak]}
                    >
                        {innhold.harIkkeOMSSakIGjenny?.gaaTilNAVKnapp?.tekst?.[spraak]}
                    </Button>
                </div>
            </VStack>
        )
    )
}
