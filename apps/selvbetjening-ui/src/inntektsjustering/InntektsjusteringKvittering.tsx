import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../common/skjemaHeader/SkjemaHeader.tsx'
import { useSanityInnhold } from '../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringKvittering as InntektsjusteringKvitteringInnhold } from '../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../common/sanity/SanityRikTekst.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const InntektsjusteringKvittering = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InntektsjusteringKvitteringInnhold>(
        '*[_type == "inntektsjusteringKvittering"]'
    )

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <HStack justify="center" padding="8">
                <VStack gap="6" maxWidth="42.5rem">
                    <SkjemaHeader aktivtSteg={4} stegLabelKey="steg4" />

                    <Heading size="large" level="2">
                        {innhold.tittel?.[spraak]}
                    </Heading>

                    <Alert variant="success">
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
                            href="https://www.nav.no"
                        >
                            {innhold.gaaTilNAVKnapp?.[spraak]}
                        </Button>
                    </div>
                </VStack>
            </HStack>
        )
    )
}
