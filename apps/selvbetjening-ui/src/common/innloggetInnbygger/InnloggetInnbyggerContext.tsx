import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { createContext, ReactNode, useContext } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { ApiError, apiURL } from '../../utils/api.ts'
import { finnAlder } from '../../inntektsjustering/2-inntekt-til-neste-aar/finnAlder.ts'
import { IkkeGyldigAlder } from '../IkkeGyldigAlder.tsx'
import { SideLaster } from '../SideLaster.tsx'
import { HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../spraak/SpraakVelger.tsx'
import { LogEvents, useAmplitude } from '../../hooks/useAmplitude.ts'
import { InntektSkjemaLukket } from '../InntektSkjemaLukket.tsx'
import { isAfter } from 'date-fns'

interface InnloggetInnbyggerContext {
    data: IInnloggetBruker | undefined
    error: ApiError | undefined
    isLoading: boolean
}

const initialInnloggetBrukerState: IInnloggetBruker = {}

const innloggetInnbyggerContext = createContext<InnloggetInnbyggerContext>({
    data: initialInnloggetBrukerState,
    error: undefined,
    isLoading: false,
})

const ProvideInnloggetInnbyggerContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const { logEvent } = useAmplitude()

    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    }: SWRResponse<IInnloggetBruker, ApiError, boolean> = useSWR(`${apiURL}/api/person/innlogget/forenklet`)

    // Hvis dagen i dag er etter 1. Januar, ikke la bruker gå videre i skjemaet
    if (isAfter(new Date(), new Date(new Date().getFullYear(), 0, 1, 4))) {
        return <InntektSkjemaLukket />
    }

    if (innloggetBrukerIsLoading) {
        return <SideLaster />
    }

    const alder: Alder = finnAlder(innloggetBruker!)

    if (alder === Alder.IKKE_GYLDIG) {
        logEvent(LogEvents.ALDER, { alder })
        return (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <HStack justify="end">
                            <SpraakVelger />
                        </HStack>
                        <IkkeGyldigAlder />
                    </VStack>
                </HStack>
            </main>
        )
    } else {
        logEvent(LogEvents.ALDER, { alder })
    }

    return (
        <innloggetInnbyggerContext.Provider
            value={{ data: innloggetBruker, error: innloggetBrukerError, isLoading: innloggetBrukerIsLoading }}
        >
            {children}
        </innloggetInnbyggerContext.Provider>
    )
}

const useInnloggetInnbygger = (): InnloggetInnbyggerContext => {
    return useContext(innloggetInnbyggerContext)
}

export { ProvideInnloggetInnbyggerContext, useInnloggetInnbygger }
