import { Bleed, FormSummary, GuidePanel, HStack, Loader, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import {
    FellesKomponenter,
    InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold,
} from '../../sanity.types.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { useInntekt } from '../../common/inntekt/InntektContext.tsx'
import { SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { finnAlder } from '../2-inntekt-til-neste-aar/finnAlder.ts'
import { Alder } from '../../types/person.ts'
import { format } from 'date-fns'
import { spraakTilDateFnsLocale } from '../../common/spraak/spraak.ts'
import { apiURL, poster } from '../../utils/api.ts'
import { useState } from 'react'
import { FeilIAPIKall } from './FeilIAPIKall.tsx'
import { velgTekstForSkalGaaAvMedAlderspensjon } from '../../utils/velgTekst.ts'

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

    if (innloggetBrukerError && !innloggetBrukerIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (fellesKomponenterInnholdError && !fellesKomponenterInnholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (inntektsjusteringOppsummeringInnholdIsLoading) {
        return <Loader />
    }
    if (inntektsjusteringOppsummeringInnholdError) {
        return <Navigate to="/system-utilgjengelig" />
    }
    if (!inntektsjusteringOppsummeringInnhold?.skjemaSammendrag) {
        return <Navigate to="/system-utilgjengelig" />
    }

    async function sendInnInntektsjustering() {
        setLaster(true)
        setApiFeil(false)
        const res = await poster(`${apiURL}/api/inntektsjustering`, { body: inntekt })
        if (res.ok) {
            navigate('/kvittering')
        } else {
            setApiFeil(true)
        }
        setLaster(false)
    }

    const { tittel, endreSvarLenke } = inntektsjusteringOppsummeringInnhold.skjemaSammendrag

    return (
        !!innloggetBruker &&
        !!fellesKomponenterInnhold &&
        !!inntektsjusteringOppsummeringInnhold && (
            <main>
                <HStack justify="center" padding="8">
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
                                    onClick={() => navigate(`/inntektsjustering/inntekt-til-neste-aar`)}
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
                                                {!!inntekt.skalGaaAvMedAlderspensjon &&
                                                    velgTekstForSkalGaaAvMedAlderspensjon(
                                                        inntekt.skalGaaAvMedAlderspensjon,
                                                        fellesKomponenterInnhold,
                                                        spraak
                                                    )}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                        {inntekt.skalGaaAvMedAlderspensjon === SkalGaaAvMedAlderspensjon.JA && (
                                            <FormSummary.Answer>
                                                <FormSummary.Label>
                                                    {
                                                        fellesKomponenterInnhold?.sammendragAvInntekt
                                                            ?.datoForAaGaaAvMedAlderspensjon?.label?.[spraak]
                                                    }
                                                </FormSummary.Label>
                                                <FormSummary.Value>
                                                    {!!inntekt.datoForAaGaaAvMedAlderspensjon &&
                                                        format(inntekt.datoForAaGaaAvMedAlderspensjon, 'MMMM yyyy', {
                                                            locale: spraakTilDateFnsLocale(spraak),
                                                        })}
                                                </FormSummary.Value>
                                            </FormSummary.Answer>
                                        )}
                                    </>
                                )}
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {fellesKomponenterInnhold?.sammendragAvInntekt?.arbeidsinntekt?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value>{inntekt.arbeidsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>

                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {
                                            fellesKomponenterInnhold?.sammendragAvInntekt?.naeringsinntekt?.label?.[
                                                spraak
                                            ]
                                        }
                                    </FormSummary.Label>
                                    <FormSummary.Value>{inntekt.naeringsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>
                                {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_SEKSTI_EN && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            {fellesKomponenterInnhold?.sammendragAvInntekt?.AFPInntekt?.label?.[spraak]}
                                        </FormSummary.Label>
                                        <FormSummary.Value>{inntekt.afpInntekt} kr</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}

                                {!!inntekt.afpInntekt && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            {
                                                fellesKomponenterInnhold?.sammendragAvInntekt?.AFPTjenesteordning
                                                    ?.label?.[spraak]
                                            }
                                        </FormSummary.Label>
                                        <FormSummary.Value>{inntekt.afpTjenesteordning}</FormSummary.Value>
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
                                    <FormSummary.Value>{inntekt.inntektFraUtland} kr</FormSummary.Value>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>

                        {apiFeil && <FeilIAPIKall />}

                        <NavigasjonMeny
                            tilbakePath="/inntekt-til-neste-aar"
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
