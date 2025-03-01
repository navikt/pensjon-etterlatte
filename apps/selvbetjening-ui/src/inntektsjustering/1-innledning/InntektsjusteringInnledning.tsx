import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Accordion, BodyShort, Button, HStack, Link, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR, { SWRResponse } from 'swr'
import { SideLaster } from '../../common/SideLaster.tsx'
import { ApiError, apiURL } from '../../common/api/api.ts'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Inntekt } from '../../types/inntektsjustering.ts'
import { useInntektDispatch } from '../components/inntektContext/InntektContext.tsx'
import { InntektsjusteringInnledning as InntektsjusteringInnledningInnhold } from '../sanity.types.ts'
import { OppgittInntektAlert } from './OppgittInntektAlert.tsx'

export const InntektsjusteringInnledning = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const inntektDispatch = useInntektDispatch()

    const {
        data: eksisterendeInntekt,
        error: eksisterendeInntektError,
        isLoading: eksisterendeInntektIsLoading,
    }: SWRResponse<Inntekt, ApiError, boolean> = useSWR(`${apiURL}/api/inntektsjustering`)

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
        if (eksisterendeInntektError && eksisterendeInntektError?.status !== 404) {
            throw eksisterendeInntektError
        } else {
            if (eksisterendeInntekt) inntektDispatch.setInntekt(eksisterendeInntekt)
        }
    }, [eksisterendeInntekt, inntektDispatch, eksisterendeInntektError])

    if (innholdIsLoading || innloggetBrukerIsLoading || eksisterendeInntektIsLoading) {
        return <SideLaster />
    }

    if (innholdError || innloggetBrukerError) {
        throw innloggetBrukerError || innholdError
    }

    return (
        !!innloggetBruker &&
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={1} stegLabelKey="steg1" skjemaNavn="inntektsjustering" />
                        <div>
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                        </div>

                        <Accordion>
                            <Accordion.Item>
                                <Accordion.Header>
                                    {
                                        innhold.behandlingAvInformasjonAccordion?.informasjonViHenterItem?.tittel?.[
                                            spraak
                                        ]
                                    }
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SanityRikTekst
                                        text={
                                            innhold.behandlingAvInformasjonAccordion?.informasjonViHenterItem
                                                ?.innhold?.[spraak]
                                        }
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    {
                                        innhold.behandlingAvInformasjonAccordion
                                            ?.hvordanViBehandlerPersonopplysningerItem?.tittel?.[spraak]
                                    }
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SanityRikTekst
                                        text={
                                            innhold.behandlingAvInformasjonAccordion
                                                ?.hvordanViBehandlerPersonopplysningerItem?.innhold?.[spraak]
                                        }
                                    />

                                    <BodyShort>
                                        {
                                            innhold.behandlingAvInformasjonAccordion
                                                ?.hvordanViBehandlerPersonopplysningerItem
                                                ?.hvordanNavBehandlerPersonopplysningerSetning?.setningStart?.[spraak]
                                        }{' '}
                                        <Link
                                            href={
                                                innhold.behandlingAvInformasjonAccordion
                                                    ?.hvordanViBehandlerPersonopplysningerItem
                                                    ?.hvordanNavBehandlerPersonopplysningerSetning?.lenkeTilNav
                                                    ?.lenke?.[spraak]
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            inlineText
                                        >
                                            {
                                                innhold.behandlingAvInformasjonAccordion
                                                    ?.hvordanViBehandlerPersonopplysningerItem
                                                    ?.hvordanNavBehandlerPersonopplysningerSetning?.lenkeTilNav
                                                    ?.tekst?.[spraak]
                                            }
                                        </Link>
                                    </BodyShort>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion>

                        {!!eksisterendeInntekt && (
                            <OppgittInntektAlert inntekt={eksisterendeInntekt} innloggetBruker={innloggetBruker} />
                        )}

                        <div>
                            <Button
                                icon={<ArrowRightIcon aria-hidden />}
                                iconPosition="right"
                                onClick={() => navigate('/inntekt/inntekt-til-neste-aar')}
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
