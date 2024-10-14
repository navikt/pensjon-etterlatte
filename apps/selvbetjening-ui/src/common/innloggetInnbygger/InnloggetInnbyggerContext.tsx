import { IInnloggetBruker } from '../../types/person.ts'
import { createContext, ReactNode, useContext } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'

interface InnloggetInnbyggerContext {
    data: IInnloggetBruker | undefined
    error: boolean | undefined
    isLoading: boolean
}

const initialInnloggetBrukerState: IInnloggetBruker = {}

const innloggetInnbyggerContext = createContext<InnloggetInnbyggerContext>({
    data: initialInnloggetBrukerState,
    error: false,
    isLoading: false,
})

const ProvideInnloggetInnbyggerContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const { data, error, isLoading }: SWRResponse<IInnloggetBruker, boolean, boolean> = useSWR(
        `${apiURL}/api/person/innlogget/forenklet`
    )

    return (
        <innloggetInnbyggerContext.Provider value={{ data, error, isLoading }}>
            {children}
        </innloggetInnbyggerContext.Provider>
    )
}

const useInnloggetInnbygger = (): InnloggetInnbyggerContext => {
    return useContext(innloggetInnbyggerContext)
}

export { ProvideInnloggetInnbyggerContext, useInnloggetInnbygger }
