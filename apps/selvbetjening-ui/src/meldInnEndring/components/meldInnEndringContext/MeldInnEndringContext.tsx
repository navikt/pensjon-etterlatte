import { HStack, VStack } from '@navikt/ds-react'
import { createContext, ReactNode, useContext, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { LogEvents, useAnalytics } from '../../../common/analytics/useAnalytics.ts'
import { ApiError, apiURL } from '../../../common/api/api.ts'
import { HarIkkeOMSSakIGjenny } from '../../../common/harIkkeOMSSakIGjenny/HarIkkeOMSSakIGjenny.tsx'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { SpraakVelger } from '../../../common/spraakVelger/SpraakVelger.tsx'
import { MeldtInnEndring, meldInnEndringDefaultValues } from '../../../types/meldInnEndring.ts'

interface MeldInnEndringDispatcher {
    setMeldInnEndring: (meldInnEndring: MeldtInnEndring) => void
}

const meldInnEndringContext = createContext(meldInnEndringDefaultValues)
const meldInnEndringDispatch = createContext({} as MeldInnEndringDispatcher)

const ProvideMeldInnEndringContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const { logEvent } = useAnalytics()

    const [meldInnEndring, setMeldInnEndring] = useState<MeldtInnEndring>(meldInnEndringDefaultValues)

    const {
        data: harOMSSakIGjenny,
        isLoading: harOMSSakIGjennyIsLoading,
        error: harOMSSakIGjennyError,
    }: SWRResponse<{ harOMSSak: boolean }, ApiError, boolean> = useSWR(`${apiURL}/api/sak/oms/har_sak`)

    if (harOMSSakIGjennyIsLoading) {
        return <SideLaster />
    }
    if (harOMSSakIGjennyError) {
        throw harOMSSakIGjennyError
    }

    const dispatcher: MeldInnEndringDispatcher = {
        setMeldInnEndring,
    }

    if (!harOMSSakIGjenny?.harOMSSak) {
        logEvent(LogEvents.INGEN_OMS_SAK, { data: {} })

        return (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <HStack justify="end">
                            <SpraakVelger />
                        </HStack>
                        <HarIkkeOMSSakIGjenny skjemaNavn="meld-inn-endring" />
                    </VStack>
                </HStack>
            </main>
        )
    }

    return (
        <meldInnEndringContext.Provider value={meldInnEndring}>
            <meldInnEndringDispatch.Provider value={dispatcher}>{children}</meldInnEndringDispatch.Provider>
        </meldInnEndringContext.Provider>
    )
}

const useMeldInnEndring = (): MeldtInnEndring => {
    return useContext(meldInnEndringContext)
}

const useMeldInnEndringDispatch = (): MeldInnEndringDispatcher => {
    return useContext(meldInnEndringDispatch)
}

export { ProvideMeldInnEndringContext, useMeldInnEndring, useMeldInnEndringDispatch }
