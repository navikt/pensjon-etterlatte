import { ReactNode, createContext, useContext } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { IInnloggetBruker } from '../../types/person.ts'
import { SideLaster } from '../SideLaster.tsx'
import { ApiError, apiURL } from '../api/api.ts'

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
    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    }: SWRResponse<IInnloggetBruker, ApiError, boolean> = useSWR(`${apiURL}/api/person/innlogget/forenklet`)

    if (innloggetBrukerIsLoading) {
        return <SideLaster />
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
