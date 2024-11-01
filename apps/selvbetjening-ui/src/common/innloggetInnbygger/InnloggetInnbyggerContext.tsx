import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { createContext, ReactNode, useContext } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { ApiError, apiURL } from '../../utils/api.ts'
import { finnAlder } from '../../inntektsjustering/2-inntekt-til-neste-aar/finnAlder.ts'
import { IkkeGyldigForAaMeldeInnInntekt } from '../IkkeGyldigForAaMeldeInnInntekt.tsx'
import { SideLaster } from '../SideLaster.tsx'
import { HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../spraak/SpraakVelger.tsx'

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
    const { data, error, isLoading }: SWRResponse<IInnloggetBruker, ApiError, boolean> = useSWR(
        `${apiURL}/api/person/innlogget/forenklet`
    )

    if (isLoading) {
        return <SideLaster />
    }

    if (finnAlder(data!) === Alder.IKKE_GYLDIG) {
        return (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <HStack justify="end">
                            <SpraakVelger />
                        </HStack>
                        <IkkeGyldigForAaMeldeInnInntekt />
                    </VStack>
                </HStack>
            </main>
        )
    }

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
