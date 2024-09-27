import { Bleed, FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold } from '../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'

export const InntektsjusteringOppsummering = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InntektsjusteringOppsummeringInnhold>(
        '*[_type == "inntektsjusteringOppsummering"]'
    )

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
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
                            <FormSummary.EditLink href="/selvbetjening/inntektsjustering/opprett">
                                {innhold.skjemaSammendrag?.endreSvarLenke?.tekst?.[spraak]}
                            </FormSummary.EditLink>
                        </FormSummary.Header>
                        {/* Hva som skal stå i disse har ikke blitt landet enda, så lar vær så lenge å lage sanity schemaer for det*/}
                        <FormSummary.Answers>
                            <FormSummary.Answer>
                                <FormSummary.Label>Hva slags type inntekter har du?</FormSummary.Label>
                                <FormSummary.Value>Arbeidsinntekt</FormSummary.Value>
                                <FormSummary.Value>Næringsinntekt</FormSummary.Value>
                            </FormSummary.Answer>
                            <FormSummary.Answer>
                                <FormSummary.Label>Hvor mye har du oppgitt i arbeidsinntekt?</FormSummary.Label>
                                <FormSummary.Value>100000000000 kr</FormSummary.Value>
                            </FormSummary.Answer>
                            <FormSummary.Answer>
                                <FormSummary.Label>Hvor mye har du oppgitt i næringsinntekt?</FormSummary.Label>
                                <FormSummary.Value>45000000000 kr</FormSummary.Value>
                            </FormSummary.Answer>
                        </FormSummary.Answers>
                    </FormSummary>

                    <NavigasjonMeny tilbakePath="/inntekt-til-neste-år" nestePath="/kvittering" skalSendeSoeknad />
                </VStack>
            </HStack>
        )
    )
}
