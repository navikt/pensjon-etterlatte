import { FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiURL, poster } from '../../common/api/api.ts'
import { logger } from '../../common/logger/logger.ts'
import { NavigasjonMeny } from '../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { SideLaster } from '../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Endring } from '../../types/meldInnEndring.ts'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from '../2-meld-fra-om-endring/forventetInntektTilNesteAar/skjemaer/utils.ts'
import { useMeldInnEndring } from '../components/meldInnEndringContext/MeldInnEndringContext.tsx'
import { MeldInnEndringOppsummering as MeldInnEndringOppsummeringInnhold } from '../sanity.types.ts'
import { FeilIOppretelseAvEndring } from './FeilIOppretelseAvEndring.tsx'
import { velgTekstForEndring } from './velgTekst.ts'

export const MeldInnEndringOppsummering = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()
    const meldInnEndring = useMeldInnEndring()

    const [laster, setLaster] = useState<boolean>(false)
    const [apiFeil, setApiFeil] = useState<boolean>(false)

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

    const sendInnEndring = async () => {
        setLaster(true)
        setApiFeil(false)

        const body = {
            ...meldInnEndring,
            forventetInntektTilNesteAar:
                meldInnEndring.endring === Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR
                    ? {
                          ...forventetInntektTilNesteAarSkjemaValuesTilValues(
                              meldInnEndring.forventetInntektTilNesteAar!
                          ),
                          inntektsaar: 2026,
                      }
                    : undefined,
        }

        try {
            const res = await poster(`${apiURL}/api/oms/meld_inn_endringer`, { body })
            if ([200, 304].includes(res.status)) {
                navigate('/meld-inn-endring/kvittering')
            }
        } catch (e) {
            logger.generalError(e as object)
            setApiFeil(true)
        }
        setLaster(false)
    }

    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" skjemaNavn="meld-inn-endring" />

                        <GuidePanel poster>
                            <SanityRikTekst text={innhold.veiledning?.[spraak]} />
                        </GuidePanel>

                        <FormSummary>
                            <FormSummary.Header>
                                <FormSummary.Heading level="2">
                                    {innhold.skjemaSammendrag?.tittel?.[spraak]}
                                </FormSummary.Heading>
                            </FormSummary.Header>
                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {innhold.skjemaSammendrag?.endring?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value>
                                        {velgTekstForEndring(meldInnEndring.endring, innhold, spraak)}
                                    </FormSummary.Value>
                                </FormSummary.Answer>
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {innhold.skjemaSammendrag?.beskrivelseAvEndring?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value style={{ whiteSpace: 'pre-line' }}>
                                        {meldInnEndring.beskrivelse}
                                    </FormSummary.Value>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                            <FormSummary.Footer>
                                <FormSummary.EditLink
                                    href="#"
                                    onClick={() => navigate('/meld-inn-endring/meld-fra-om-endring')}
                                >
                                    {innhold.skjemaSammendrag?.endreSvarLenke?.tekst?.[spraak]}
                                </FormSummary.EditLink>
                            </FormSummary.Footer>
                        </FormSummary>

                        {apiFeil && <FeilIOppretelseAvEndring />}

                        <NavigasjonMeny
                            tilbakePath="/meld-inn-endring/meld-fra-om-endring"
                            onNeste={sendInnEndring}
                            nesteLaster={laster}
                            skalSendeInnSkjema
                        />
                    </VStack>
                </HStack>
            </main>
        )
    )
}
