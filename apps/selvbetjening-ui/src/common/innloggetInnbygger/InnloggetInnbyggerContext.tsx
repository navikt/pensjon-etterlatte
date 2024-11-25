import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { createContext, ReactNode, useContext } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { ApiError, apiURL } from '../../utils/api.ts'
import { finnAlder } from '../../inntektsjustering/2-inntekt-til-neste-aar/finnAlder.ts'
import { SideLaster } from '../SideLaster.tsx'
import { LogEvents, useAmplitude } from '../../hooks/useAmplitude.ts'
import { Navigate } from 'react-router-dom'

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

    if (innloggetBrukerIsLoading) {
        return <SideLaster />
    }

    const alder: Alder = finnAlder(innloggetBruker!)

    if (alder === Alder.IKKE_GYLDIG) {
        logEvent(LogEvents.ALDER, { alder })
        return <Navigate to="ikke-gyldig-alder" />
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
