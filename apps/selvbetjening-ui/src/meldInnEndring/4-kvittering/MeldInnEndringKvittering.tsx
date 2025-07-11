import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { LogEvents, useAnalytics } from '../../common/analytics/useAnalytics.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Endring } from '../../types/meldInnEndring.ts'
import { useMeldInnEndring } from '../components/meldInnEndringContext/MeldInnEndringContext.tsx'
import { MeldInnEndringKvittering as MeldInnEndringKvitteringInnhold } from '../sanity.types.ts'

export const MeldInnEndringKvittering = () => {
    const spraak = useSpraak()

    const meldInnEndring = useMeldInnEndring()

    const { logEvent } = useAnalytics()

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
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={4} stegLabelKey="steg4" skjemaNavn="meld-inn-endring" />

                        <Heading size="large" level="2">
                            {innhold.tittel?.[spraak]}
                        </Heading>

                        {meldInnEndring.endring === Endring.SVAR_PAA_ETTEROPPGJOER ? (
                            <>
                                <Alert variant="success">{innhold.svarPaEtteroppgjoerSuksess?.[spraak]}</Alert>
                                <div>
                                    <Button
                                        as="a"
                                        rel="noopener noreferrer"
                                        onClick={() => logEvent(LogEvents.ETTERSEND_DOKUMENTASJON_KLIKK)}
                                        href={innhold.ettersendDokumentasjonKnapp?.lenke?.[spraak]}
                                    >
                                        {innhold.ettersendDokumentasjonKnapp?.tekst?.[spraak]}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Alert variant="success" className="success-alert">
                                    <SanityRikTekst text={innhold.suksess?.[spraak]} />
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
                            </>
                        )}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
