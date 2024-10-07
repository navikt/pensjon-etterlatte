import { Bleed, FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold } from '../../sanity.types.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { useInntekt } from '../../common/inntekt/InntektContext.tsx'

export const InntektsjusteringOppsummering = () => {
    const spraak = useSpraak()
    const navigate = useNavigate()
    const inntekt = useInntekt()

    const { innhold, error, isLoading } = useSanityInnhold<InntektsjusteringOppsummeringInnhold>(
        '*[_type == "inntektsjusteringOppsummering"]'
    )

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" />

                        <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                            <GuidePanel>
                                <SanityRikTekst text={innhold.veiledning?.[spraak]} />
                            </GuidePanel>
                        </Bleed>

                        <FormSummary>
                            <FormSummary.Header>
                                <FormSummary.Heading level="2">
                                    {innhold.skjemaSammendrag?.tittel?.[spraak]}
                                </FormSummary.Heading>
                                <FormSummary.EditLink
                                    onClick={() => navigate(`/inntektsjustering/inntekt-til-neste-aar`)}
                                >
                                    {innhold.skjemaSammendrag?.endreSvarLenke?.tekst?.[spraak]}
                                </FormSummary.EditLink>
                            </FormSummary.Header>
                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    <FormSummary.Label>Hvor mye har du oppgitt i arbeidsinntekt?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.arbeidsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>
                                <FormSummary.Answer>
                                    <FormSummary.Label>Hvor mye har du oppgitt i næringsinntekt?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.naeringsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>
                                <FormSummary.Answer>
                                    <FormSummary.Label>Hvor mye har du oppgitt i inntekt fra utland?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.inntektFraUtland} kr</FormSummary.Value>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>

                        <NavigasjonMeny tilbakePath="/inntekt-til-neste-aar" nestePath="/kvittering" skalSendeSoeknad />
                    </VStack>
                </HStack>
            </main>
        )
    )
}
