import { Bleed, FormSummary, GuidePanel, HStack, Loader, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringOppsummering as InntektsjusteringOppsummeringInnhold } from '../../sanity.types.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { useInntekt } from '../../common/inntekt/InntektContext.tsx'
import { SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { finnAlder } from '../2-inntekt-til-neste-aar/finnAlder.ts'
import { Alder } from '../../types/person.ts'
import { format, Locale } from 'date-fns'
import { Spraak } from '../../common/spraak/spraak.ts'
import { nb, nn, enGB } from 'date-fns/locale'
import { apiURL, poster } from '../../utils/api.ts'
import { useState } from 'react'
import { FeilIAPIKall } from './FeilIAPIKall.tsx'

const spraakTilDateFnsLocale = (spraak: Spraak): Locale => {
    switch (spraak) {
        case Spraak.BOKMAAL:
            return nb
        case Spraak.NYNORSK:
            return nn
        case Spraak.ENGELSK:
            return enGB
        default:
            return nb
    }
}

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
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringOppsummeringInnhold>('*[_type == "inntektsjusteringOppsummering"]')

    if (innloggetBrukerError && !innloggetBrukerIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (innholdIsLoading) {
        return <Loader />
    }
    if (innholdError) {
        return <Navigate to="/system-utilgjengelig" />
    }
    if (!innhold?.skjemaSammendrag) {
        return <Navigate to="/system-utilgjengelig" />
    }

    async function sendInnInntektsjustering() {
        setLaster(true)
        setApiFeil(false)
        const res = await poster(`${apiURL}/api/inntektsjustering`, { body: inntekt })
        if (res.ok) {
            navigate('/inntektsjustering/kvittering')
        } else {
            setApiFeil(true)
        }
        setLaster(false)
    }

    const {
        tittel,
        endreSvarLenke,
        skalGaaAvMedAlderspensjon,
        datoForAaGaaAvMedAlderspensjon,
        arbeidsinntekt,
        naeringsinntekt,
        AFPInntekt,
        AFPTjenesteordning,
        inntektFraUtland,
    } = innhold.skjemaSammendrag

    const velgTekstForSkalGaaAvMedAlderspensjon = (
        skalGaaAvMedAlderspensjonValue: SkalGaaAvMedAlderspensjon
    ): string | undefined => {
        switch (skalGaaAvMedAlderspensjonValue) {
            case SkalGaaAvMedAlderspensjon.JA:
                return skalGaaAvMedAlderspensjon?.value?.ja?.[spraak]
            case SkalGaaAvMedAlderspensjon.NEI:
                return skalGaaAvMedAlderspensjon?.value?.nei?.[spraak]
            case SkalGaaAvMedAlderspensjon.VET_IKKE:
                return skalGaaAvMedAlderspensjon?.value?.vetIkke?.[spraak]
        }
    }

    return (
        !!innloggetBruker &&
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
                                <FormSummary.Heading level="2">{tittel?.[spraak]}</FormSummary.Heading>
                                <FormSummary.EditLink
                                    onClick={() => navigate(`/inntektsjustering/inntekt-til-neste-aar`)}
                                >
                                    {endreSvarLenke?.tekst?.[spraak]}
                                </FormSummary.EditLink>
                            </FormSummary.Header>
                            <FormSummary.Answers>
                                {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_FEMTI_SEKS && (
                                    <>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {finnAlder(innloggetBruker) === Alder.FEMTI_SYV_TIL_SEKSTI_SEKS
                                                    ? skalGaaAvMedAlderspensjon?.label?.femtiSyvTilSekstiSeksAar?.[
                                                          spraak
                                                      ]
                                                    : skalGaaAvMedAlderspensjon?.label?.sekstiSyvAar?.[spraak]}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {!!inntekt.skalGaaAvMedAlderspensjon &&
                                                    velgTekstForSkalGaaAvMedAlderspensjon(
                                                        inntekt.skalGaaAvMedAlderspensjon
                                                    )}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                        {inntekt.skalGaaAvMedAlderspensjon === SkalGaaAvMedAlderspensjon.JA && (
                                            <FormSummary.Answer>
                                                <FormSummary.Label>
                                                    {datoForAaGaaAvMedAlderspensjon?.label?.[spraak]}
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
                                    <FormSummary.Label>{arbeidsinntekt?.label?.[spraak]}</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.arbeidsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>

                                <FormSummary.Answer>
                                    <FormSummary.Label>{naeringsinntekt?.label?.[spraak]}</FormSummary.Label>
                                    <FormSummary.Value>{inntekt.naeringsinntekt} kr</FormSummary.Value>
                                </FormSummary.Answer>
                                {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_FEMTI_SEKS && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>{AFPInntekt?.label?.[spraak]}</FormSummary.Label>
                                        <FormSummary.Value>{inntekt.AFPInntekt} kr</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}

                                {!!inntekt.AFPInntekt && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>{AFPTjenesteordning?.label?.[spraak]}</FormSummary.Label>
                                        <FormSummary.Value>{inntekt.AFPTjenesteordning}</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}

                                <FormSummary.Answer>
                                    <FormSummary.Label>{inntektFraUtland?.label?.[spraak]}</FormSummary.Label>
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
