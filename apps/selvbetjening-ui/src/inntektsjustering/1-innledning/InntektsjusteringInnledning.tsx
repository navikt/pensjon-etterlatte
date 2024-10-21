import { Alert, Bleed, BodyShort, Button, GuidePanel, Heading, HStack, Label, VStack } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Navigate, useNavigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInnledning as InntektsjusteringInnledningInnhold } from '../../sanity.types.ts'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'
import { Inntekt, SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { useInntektDispatch } from '../../common/inntekt/InntektContext.tsx'
import { useEffect } from 'react'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { finnAlder } from '../2-inntekt-til-neste-aar/finnAlder.ts'
import { Alder } from '../../types/person.ts'
import { format, Locale } from 'date-fns'
import { Spraak } from '../../common/spraak/spraak.ts'
import { enGB, nb, nn } from 'date-fns/locale'

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

export const InntektsjusteringInnledning = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const inntektDispatch = useInntektDispatch()

    const { data: eksisterendeInntekt }: SWRResponse<Inntekt, boolean, boolean> = useSWR(
        `${apiURL}/api/inntektsjustering`
    )

    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    } = useInnloggetInnbygger()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInnledningInnhold>('*[_type == "inntektsjusteringInnledning"]')

    useEffect(() => {
        if (eksisterendeInntekt) inntektDispatch.setInntekt(eksisterendeInntekt)
    }, [eksisterendeInntekt, inntektDispatch])

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (innloggetBrukerError && !innloggetBrukerIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const velgTekstForSkalGaaAvMedAlderspensjon = (
        skalGaaAvMedAlderspensjonValue: SkalGaaAvMedAlderspensjon
    ): string | undefined => {
        switch (skalGaaAvMedAlderspensjonValue) {
            case SkalGaaAvMedAlderspensjon.JA:
                return 'Ja'
            case SkalGaaAvMedAlderspensjon.NEI:
                return 'Nei'
            case SkalGaaAvMedAlderspensjon.VET_IKKE:
                return 'Vet ikke'
        }
    }

    // TODO: lage et "sammendrag av oppgitt inntekt" schema
    return (
        !!innloggetBruker &&
        !!innhold && (
            <main>
                <HStack justify="center" padding="8">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={1} stegLabelKey="steg1" />
                        <div>
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                        </div>

                        {!!eksisterendeInntekt && (
                            <Alert variant="info">
                                <Heading spacing size="small" level="3">
                                    Du har allerede meldt inntekt til neste år
                                </Heading>
                                <VStack gap="6">
                                    <BodyShort>Du har allerede oppgitt følgende inntekt</BodyShort>
                                    <VStack gap="2">
                                        {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_FEMTI_SEKS && (
                                            <>
                                                <div>
                                                    <Label>
                                                        {finnAlder(innloggetBruker) === Alder.FEMTI_SYV_TIL_SEKSTI_SEKS
                                                            ? 'Skal gå av med alderspensjon, 57-66'
                                                            : 'Skal gå av med alderspensjon, 67'}
                                                    </Label>
                                                    <BodyShort>
                                                        {!!eksisterendeInntekt.skalGaaAvMedAlderspensjon &&
                                                            velgTekstForSkalGaaAvMedAlderspensjon(
                                                                eksisterendeInntekt.skalGaaAvMedAlderspensjon
                                                            )}
                                                    </BodyShort>
                                                </div>
                                                {eksisterendeInntekt.skalGaaAvMedAlderspensjon ===
                                                    SkalGaaAvMedAlderspensjon.JA && (
                                                    <div>
                                                        <Label>Når skal du gå av med alderspensjon</Label>
                                                        <BodyShort>
                                                            {!!eksisterendeInntekt.datoForAaGaaAvMedAlderspensjon &&
                                                                format(
                                                                    eksisterendeInntekt.datoForAaGaaAvMedAlderspensjon,
                                                                    'MMMM yyyy',
                                                                    {
                                                                        locale: spraakTilDateFnsLocale(spraak),
                                                                    }
                                                                )}
                                                        </BodyShort>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div>
                                            <Label>Arbeidsinntekt</Label>
                                            <BodyShort>{eksisterendeInntekt.arbeidsinntekt} kr</BodyShort>
                                        </div>

                                        <div>
                                            <Label>Næringsinntekt</Label>
                                            <BodyShort>{eksisterendeInntekt.naeringsinntekt} kr</BodyShort>
                                        </div>

                                        {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_FEMTI_SEKS && (
                                            <div>
                                                <Label>AFP inntekt</Label>
                                                <BodyShort>{eksisterendeInntekt.AFPInntekt} kr</BodyShort>
                                            </div>
                                        )}

                                        {!!eksisterendeInntekt.AFPInntekt && (
                                            <div>
                                                <Label>AFP tjensteordning</Label>
                                                <BodyShort>{eksisterendeInntekt.AFPTjenesteordning}</BodyShort>
                                            </div>
                                        )}
                                        <div>
                                            <Label>Inntekt fra utland</Label>
                                            <BodyShort>{eksisterendeInntekt.inntektFraUtland} kr</BodyShort>
                                        </div>
                                    </VStack>
                                    <BodyShort>
                                        Hvis denne informasjonen ikke stemmer, kan du sende inn på nytt.
                                    </BodyShort>
                                </VStack>
                            </Alert>
                        )}

                        <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                            <GuidePanel>
                                <SanityRikTekst text={innhold.veiledning?.[spraak]} />
                            </GuidePanel>
                        </Bleed>
                        <div>
                            <Button
                                icon={<ArrowRightIcon aria-hidden />}
                                iconPosition="right"
                                onClick={() => navigate('/inntektsjustering/inntekt-til-neste-aar')}
                            >
                                {innhold.startUtfyllingKnapp?.[spraak]}
                            </Button>
                        </div>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
