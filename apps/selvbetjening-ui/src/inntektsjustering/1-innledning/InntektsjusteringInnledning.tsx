import { Button, HStack, VStack } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Navigate, useNavigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInnledning as InntektsjusteringInnledningInnhold } from '../../sanity.types.ts'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'
import { Inntekt } from '../../types/inntektsjustering.ts'
import { useInntektDispatch } from '../../common/inntekt/InntektContext.tsx'
import { useEffect } from 'react'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { OppgittInntektAlert } from './OppgittInntektAlert.tsx'

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
                            <OppgittInntektAlert inntekt={eksisterendeInntekt} innloggetBruker={innloggetBruker} />
                        )}

                        <div>
                            <Button
                                icon={<ArrowRightIcon aria-hidden />}
                                iconPosition="right"
                                onClick={() => navigate('/inntekt-til-neste-aar')}
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
