import { Bleed, FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold } from '../../sanity.types.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { useInntekt } from '../../common/inntekt/InntektContext.tsx'
import { SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'

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

    // TODO: må få inn noen sjekker på alder og om man har fylt ut ting riktig, hvis ikke send dem tilbake til skjema?

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
                                    <FormSummary.Label>Skal du gå av med alderspensjon?</FormSummary.Label>
                                    <FormSummary.Value>
                                        {/* TODO: den her må oversettes på en god måte*/}
                                        {!!inntekt.skalGaaAvMedAlderspensjon && inntekt.skalGaaAvMedAlderspensjon}
                                    </FormSummary.Value>
                                </FormSummary.Answer>
                                {inntekt.skalGaaAvMedAlderspensjon === SkalGaaAvMedAlderspensjon.JA && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            Når planlegger du å gå av med alderspensjon?
                                        </FormSummary.Label>
                                        {/* TODO: den her må oversettes på en god måte*/}
                                        {/* TODO: må skriver på formatet: måned-år, aka mars 2025*/}
                                        <FormSummary.Value>
                                            {!!inntekt.datoForAaGaaAvMedAlderspensjon &&
                                                inntekt.datoForAaGaaAvMedAlderspensjon.toString()}
                                        </FormSummary.Value>
                                    </FormSummary.Answer>
                                )}
                                <FormSummary.Answer>
                                    <FormSummary.Label>Hvor mye har du oppgitt i arbeidsinntekt?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.arbeidsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>

                                <FormSummary.Answer>
                                    <FormSummary.Label>Hvor mye har du oppgitt i næringsinntekt?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.naeringsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>
                                <FormSummary.Answer>
                                    <FormSummary.Label>Hva har du oppgitt i AFP inntekt?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.AFPInntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>

                                {!!inntekt.AFPInntekt && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            Hvilken tjenesteordning for AFP har du oppgitt?
                                        </FormSummary.Label>
                                        <FormSummary.Value>{inntekt.AFPTjenesteordning}</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}

                                <FormSummary.Answer>
                                    <FormSummary.Label>Hvor mye har du oppgitt i inntekt fra utland?</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.inntektFraUtland} kr</FormSummary.Value>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>

                        <NavigasjonMeny
                            tilbakePath="/inntekt-til-neste-aar"
                            onNeste={() => navigate('/inntektsjustering/kvittering')}
                            skalSendeSoeknad
                        />
                    </VStack>
                </HStack>
            </main>
        )
    )
}
