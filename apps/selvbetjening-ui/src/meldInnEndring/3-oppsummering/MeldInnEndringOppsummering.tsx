import { Bleed, FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringOppsummering as MeldInnEndringOppsummeringInnhold } from '../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useNavigate } from 'react-router-dom'
import { velgTekstForEndring } from './velgTekst.ts'
import { Endring } from '../../types/meldInnEndring.ts'

export const MeldInnEndringOppsummering = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<MeldInnEndringOppsummeringInnhold>('*[_type == "meldInnEndringOppsummering"]')

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
                        <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" skjemaNavn="meld-inn-endring" />

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
                                    href="#"
                                    onClick={() => navigate('/meld-inn-endring/meld-fra-om-endring')}
                                >
                                    {innhold.skjemaSammendrag?.endreSvarLenke?.tekst?.[spraak]}
                                </FormSummary.EditLink>
                            </FormSummary.Header>
                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {innhold.skjemaSammendrag?.endring?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value>
                                        {velgTekstForEndring(Endring.AKTIVITET_OG_INNTEKT, innhold, spraak)}
                                    </FormSummary.Value>
                                </FormSummary.Answer>
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {innhold.skjemaSammendrag?.beskrivelseAvEndring?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value>asd</FormSummary.Value>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
