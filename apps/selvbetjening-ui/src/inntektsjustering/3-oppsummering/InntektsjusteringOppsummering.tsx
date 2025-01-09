import { Bleed, FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../components/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import {
    FellesKomponenter,
    InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold,
} from '../../sanity.types.ts'
import { useNavigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { InntektSkjema, SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { finnAlder } from '../2-inntekt-til-neste-aar/finnAlder.ts'
import { Alder } from '../../types/person.ts'
import { format } from 'date-fns'
import { spraakTilDateFnsLocale } from '../../common/spraak/spraak.ts'
import { apiURL, poster } from '../../common/api/api.ts'
import { useState } from 'react'
import { FeilIAPIKall } from './FeilIAPIKall.tsx'
import { velgTekstForSkalGaaAvMedAlderspensjon } from '../utils/velgTekst.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { logger } from '../../common/logger/logger.ts'
import { useInntekt } from '../components/inntektContext/InntektContext.tsx'
import { inntektTilInntektSkjemaValues } from '../2-inntekt-til-neste-aar/skjemaer/utils.ts'

export const InntektsjusteringOppsummering = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()
    const inntekt = useInntekt()

    const [laster, setLaster] = useState<boolean>(false)
    const [apiFeil, setApiFeil] = useState<boolean>(false)

    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    } = useInnloggetInnbygger()

    const {
        innhold: fellesKomponenterInnhold,
        error: fellesKomponenterInnholdError,
        isLoading: fellesKomponenterInnholdIsLoading,
    } = useSanityInnhold<FellesKomponenter>('*[_type == "fellesKomponenter"]')

    const {
        innhold: inntektsjusteringOppsummeringInnhold,
        error: inntektsjusteringOppsummeringInnholdError,
        isLoading: inntektsjusteringOppsummeringInnholdIsLoading,
    } = useSanityInnhold<InntektsjusteringOppsummeringInnhold>('*[_type == "inntektsjusteringOppsummering"]')

    if (
        innloggetBrukerIsLoading ||
        fellesKomponenterInnholdIsLoading ||
        inntektsjusteringOppsummeringInnholdIsLoading
    ) {
        return <SideLaster />
    }
    if (innloggetBrukerError || fellesKomponenterInnholdError || inntektsjusteringOppsummeringInnholdError) {
        throw innloggetBrukerError || fellesKomponenterInnholdError || inntektsjusteringOppsummeringInnholdError
    }

    if (!inntektsjusteringOppsummeringInnhold?.skjemaSammendrag) {
        throw new Error('Fant ikke sanity innhold for skjema sammendrag')
    }

    async function sendInnInntektsjustering() {
        setLaster(true)
        setApiFeil(false)
        try {
            const res = await poster(`${apiURL}/api/inntektsjustering`, { body: inntekt })
            if ([200, 304].includes(res.status)) {
                navigate('/inntekt/kvittering')
            } else {
                setApiFeil(true)
            }
        } catch (e) {
            logger.generalError(e as object)
            setApiFeil(true)
        }
        setLaster(false)
    }

    const inntektSkjemaValues: InntektSkjema = inntektTilInntektSkjemaValues(inntekt, spraak)

    const { tittel, endreSvarLenke } = inntektsjusteringOppsummeringInnhold.skjemaSammendrag

    return (
        !!innloggetBruker &&
        !!fellesKomponenterInnhold &&
        !!inntektsjusteringOppsummeringInnhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" />

                        <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                            <GuidePanel>
                                <SanityRikTekst text={inntektsjusteringOppsummeringInnhold.veiledning?.[spraak]} />
                            </GuidePanel>
                        </Bleed>

                        <FormSummary>
                            <FormSummary.Header>
                                <FormSummary.Heading level="2">{tittel?.[spraak]}</FormSummary.Heading>
                                <FormSummary.EditLink
                                    href="#"
                                    onClick={() => navigate(`/inntekt/inntekt-til-neste-aar`)}
                                >
                                    {endreSvarLenke?.tekst?.[spraak]}
                                </FormSummary.EditLink>
                            </FormSummary.Header>
                            <FormSummary.Answers>
                                {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_SEKSTI_EN && (
                                    <>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {finnAlder(innloggetBruker) === Alder.SEKSTI_TO_TIL_SEKSTI_SEKS
                                                    ? fellesKomponenterInnhold?.sammendragAvInntekt
                                                          ?.skalGaaAvMedAlderspensjon?.label
                                                          ?.femtiSyvTilSekstiSeksAar?.[spraak]
                                                    : fellesKomponenterInnhold?.sammendragAvInntekt
                                                          ?.skalGaaAvMedAlderspensjon?.label?.sekstiSyvAar?.[spraak]}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {!!inntektSkjemaValues.skalGaaAvMedAlderspensjon &&
                                                    velgTekstForSkalGaaAvMedAlderspensjon(
                                                        inntektSkjemaValues.skalGaaAvMedAlderspensjon,
                                                        fellesKomponenterInnhold,
                                                        spraak
                                                    )}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                        {inntektSkjemaValues.skalGaaAvMedAlderspensjon ===
                                            SkalGaaAvMedAlderspensjon.JA && (
                                            <FormSummary.Answer>
                                                <FormSummary.Label>
                                                    {
                                                        fellesKomponenterInnhold?.sammendragAvInntekt
                                                            ?.datoForAaGaaAvMedAlderspensjon?.label?.[spraak]
                                                    }
                                                </FormSummary.Label>
                                                <FormSummary.Value>
                                                    {!!inntektSkjemaValues.datoForAaGaaAvMedAlderspensjon &&
                                                        format(
                                                            inntektSkjemaValues.datoForAaGaaAvMedAlderspensjon,
                                                            'MMMM yyyy',
                                                            {
                                                                locale: spraakTilDateFnsLocale(spraak),
                                                            }
                                                        )}
                                                </FormSummary.Value>
                                            </FormSummary.Answer>
                                        )}
                                    </>
                                )}
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {fellesKomponenterInnhold?.sammendragAvInntekt?.arbeidsinntekt?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value>{inntektSkjemaValues.arbeidsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>

                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {
                                            fellesKomponenterInnhold?.sammendragAvInntekt?.naeringsinntekt?.label?.[
                                                spraak
                                            ]
                                        }
                                    </FormSummary.Label>
                                    <FormSummary.Value>{inntektSkjemaValues.naeringsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>
                                {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_SEKSTI_EN && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            {fellesKomponenterInnhold?.sammendragAvInntekt?.AFPInntekt?.label?.[spraak]}
                                        </FormSummary.Label>
                                        <FormSummary.Value>{inntektSkjemaValues.afpInntekt} kr</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}

                                {!!inntektSkjemaValues.afpInntekt && inntektSkjemaValues.afpInntekt !== '0' && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            {
                                                fellesKomponenterInnhold?.sammendragAvInntekt?.AFPTjenesteordning
                                                    ?.label?.[spraak]
                                            }
                                        </FormSummary.Label>
                                        <FormSummary.Value>{inntektSkjemaValues.afpTjenesteordning}</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}

                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {
                                            fellesKomponenterInnhold?.sammendragAvInntekt?.inntektFraUtland?.label?.[
                                                spraak
                                            ]
                                        }
                                    </FormSummary.Label>
                                    <FormSummary.Value>{inntektSkjemaValues.inntektFraUtland} kr</FormSummary.Value>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>

                        {apiFeil && <FeilIAPIKall />}

                        <NavigasjonMeny
                            tilbakePath="/inntekt/inntekt-til-neste-aar"
                            onNeste={sendInnInntektsjustering}
                            nesteLaster={laster}
                            skalSendeSoeknad
                        />
                    </VStack>
                </HStack>
            </main>
        )
    )
}
