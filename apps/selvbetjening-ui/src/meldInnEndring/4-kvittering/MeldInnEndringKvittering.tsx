import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringKvittering as MeldInnEndringKvitteringInnhold } from '../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const MeldInnEndringKvittering = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<MeldInnEndringKvitteringInnhold>('*[_type == "meldInnEndringKvittering"]')

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
                        <SkjemaHeader aktivtSteg={4} stegLabelKey="steg4" skjemaNavn="meld-inn-endring" />

                        <Heading size="large" level="2">
                            {innhold.tittel?.[spraak]}
                        </Heading>

                        <Alert variant="success" className="success-alert">
                            <SanityRikTekst text={innhold.suksess?.[spraak]} />
                        </Alert>
                    </VStack>

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
                </HStack>
            </main>
        )
    )
}
