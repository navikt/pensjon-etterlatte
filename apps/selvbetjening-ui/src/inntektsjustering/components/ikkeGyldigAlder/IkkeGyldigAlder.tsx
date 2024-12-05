import { Button, VStack } from '@navikt/ds-react'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { IkkeGyldigForAaMeldeInnInntekt } from '../../../sanity.types.ts'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
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
