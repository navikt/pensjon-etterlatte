import { Button, HStack, VStack } from '@navikt/ds-react'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { SpraakVelger } from '../../../common/spraak/SpraakVelger.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { InntektSkjemaLukket as InntektSkjemaLukketInnhold } from '../../../sanity.types.ts'

export const InntektSkjemaLukket = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InntektSkjemaLukketInnhold>(
        '*[_type == "inntektSkjemaLukket"]'
    )

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
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                            <Button
                                as="a"
                                variant="primary"
                                icon={<ArrowRightIcon aria-hidden />}
                                iconPosition="right"
                                rel="noopener noreferrer"
                                href={innhold.gaaTilNAVKnapp?.lenke?.[spraak]}
                            >
                                {innhold.gaaTilNAVKnapp?.tekst?.[spraak]}
                            </Button>
                        </div>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
