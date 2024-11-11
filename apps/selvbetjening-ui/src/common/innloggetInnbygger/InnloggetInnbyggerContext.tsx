import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { createContext, ReactNode, useContext } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { ApiError, apiURL } from '../../utils/api.ts'
import { finnAlder } from '../../inntektsjustering/2-inntekt-til-neste-aar/finnAlder.ts'
import { IkkeGyldigAlder } from '../IkkeGyldigAlder.tsx'
import { SideLaster } from '../SideLaster.tsx'
import { HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../spraak/SpraakVelger.tsx'
import { HarIkkeOMSSakAlert } from '../HarIkkeOMSSakAlert.tsx'

interface InnloggetInnbyggerContext {
    data: IInnloggetBruker | undefined
    error: ApiError | undefined
    isLoading: boolean
    //TODO, kan jeg bare sende videre nedover om noe har gått galt i kallet mot sak apiet?
    // Hvis undefined, så "kunne vi ikke hente det"
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

    const {
        data: harOMSSakIGjenny,
        isLoading: harOMSSakIGjennyIsLoading,
    }: SWRResponse<{ harOMSSak: boolean }, ApiError, boolean> = useSWR(`${apiURL}/api/sak/oms/har_sak`)

    if (innloggetBrukerIsLoading || harOMSSakIGjennyIsLoading) {
        return <SideLaster />
    }

    // Hvis det er feil i API'et for å sjekke om bruker har OMS sak så stopper vi ikke bruker.
    // Dette er for å la bruker fortsatt melde inn inntekt som om API'et er nede e.l.
    if (!harOMSSakIGjenny?.harOMSSak) {
        return (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <HStack justify="end">
                            <SpraakVelger />
                        </HStack>
                        <HarIkkeOMSSakAlert />
                    </VStack>
                </HStack>
            </main>
        )
    }
    if (finnAlder(innloggetBruker!) === Alder.IKKE_GYLDIG) {
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
