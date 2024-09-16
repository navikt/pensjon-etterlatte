import { Bleed, FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold } from '../../sanity.types.ts'
import { Navigate } from 'react-router-dom'

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
                    </FormSummary>
                </VStack>
            </HStack>
        )
    )
}
