import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Button, HStack, VStack } from '@navikt/ds-react'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SpraakVelger } from '../../../common/spraakVelger/SpraakVelger.tsx'
import { InntektSkjemaLukket as InntektSkjemaLukketInnhold } from '../../sanity.types.ts'

export const InntektSkjemaLukket = () => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<InntektSkjemaLukketInnhold>(
        '*[_type == "inntektSkjemaLukket"]'
    )

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
