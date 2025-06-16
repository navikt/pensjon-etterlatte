import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Button, HStack, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR, { SWRResponse } from 'swr'
import { SideLaster } from '../../common/SideLaster.tsx'
import { ApiError, apiURL } from '../../common/api/api.ts'
import { BehandlingAvInformasjonAccordion } from '../../common/behandlingAvInformasjonAccordion/BehandlingAvInformasjonAccordion.tsx'
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

                        <BehandlingAvInformasjonAccordion />

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
