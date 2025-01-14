import { createContext, ReactNode, useContext, useState } from 'react'
import { HStack, VStack } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { Inntekt, inntektDefaultValues } from '../../../types/inntektsjustering.ts'
import { Alder, IInnloggetBruker } from '../../../types/person.ts'
import { ApiError, apiURL } from '../../../common/api/api.ts'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { logger } from '../../../common/logger/logger.ts'
import { SpraakVelger } from '../../../common/spraakVelger/SpraakVelger.tsx'
import { HarIkkeOMSSakIGjenny } from '../../1-innledning/HarIkkeOMSSakIGjenny.tsx'
import { finnAlder } from '../../2-inntekt-til-neste-aar/finnAlder.ts'
import { IkkeGyldigAlder } from '../ikkeGyldigAlder/IkkeGyldigAlder.tsx'
import { LogEvents, useAmplitude } from '../../../common/amplitude/useAmplitude.ts'

interface InntektDispatcher {
    setInntekt: (inntekt: Inntekt) => void
}

const inntektContext = createContext(inntektDefaultValues)
const inntektDispatch = createContext({} as InntektDispatcher)

const ProvideInntektContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const { logEvent } = useAmplitude()

    const [inntekt, setInntekt] = useState<Inntekt>(inntektDefaultValues)

    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    }: SWRResponse<IInnloggetBruker, ApiError, boolean> = useSWR(`${apiURL}/api/person/innlogget/forenklet`)

    const {
        data: harOMSSakIGjenny,
        isLoading: harOMSSakIGjennyIsLoading,
        error: harOMSSakIGjennyError,
    }: SWRResponse<{ harOMSSak: boolean }, ApiError, boolean> = useSWR(`${apiURL}/api/sak/oms/har_sak`)

    if (innloggetBrukerIsLoading || harOMSSakIGjennyIsLoading) {
        return <SideLaster />
    }

    if (innloggetBrukerError) {
        throw innloggetBrukerError
    }

    if (harOMSSakIGjennyError) {
        logger.generalError(harOMSSakIGjennyError)
    }

    const dispatcher: InntektDispatcher = {
        setInntekt,
    }

    if (!harOMSSakIGjenny?.harOMSSak && !harOMSSakIGjennyError) {
        logEvent(LogEvents.INGEN_OMS_SAK, { data: {} })

        return (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <HStack justify="end">
                            <SpraakVelger />
                        </HStack>
                        <HarIkkeOMSSakIGjenny />
                    </VStack>
                </HStack>
            </main>
        )
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
        <inntektContext.Provider value={inntekt}>
            <inntektDispatch.Provider value={dispatcher}>{children}</inntektDispatch.Provider>
        </inntektContext.Provider>
    )
}

const useInntekt = (): Inntekt => {
    return useContext(inntektContext)
}

const useInntektDispatch = (): InntektDispatcher => {
    return useContext(inntektDispatch)
}

export { ProvideInntektContext, useInntekt, useInntektDispatch }
