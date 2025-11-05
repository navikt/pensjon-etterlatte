import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { SideLaster } from '../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { InntektsjusteringKvittering as InntektsjusteringKvitteringInnhold } from '../sanity.types.ts'
import './index.css'

export const InntektsjusteringKvittering = () => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<InntektsjusteringKvitteringInnhold>(
        '*[_type == "inntektsjusteringKvittering"]'
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
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={4} stegLabelKey="steg4" skjemaNavn="inntektsjustering" />

                        <Heading size="large" level="2">
                            {innhold.tittel?.[spraak]}
                        </Heading>

                        <Alert variant="success" className="success-alert">
                            <SanityRikTekst text={innhold.suksess?.[spraak]} />
                        </Alert>

                        <Alert variant="info">
                            <Heading size="small" level="3" spacing>
                                {innhold.info?.tittel?.[spraak]}
                            </Heading>
                            <SanityRikTekst text={innhold.info?.beskrivelse?.[spraak]} />
                        </Alert>

                        <div>
                            <Button
                                as="a"
                                variant="tertiary"
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
