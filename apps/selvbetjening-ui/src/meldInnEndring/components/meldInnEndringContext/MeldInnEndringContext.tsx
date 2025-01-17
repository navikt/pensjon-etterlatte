import { meldInnEndringDefaultValues, MeldtInnEndring } from '../../../types/meldInnEndring.ts'
import { createContext, ReactNode, useContext, useState } from 'react'

interface MeldInnEndringDispatcher {
    setMeldInnEndring: (meldInnEndring: MeldtInnEndring) => void
}

const meldInnEndringContext = createContext(meldInnEndringDefaultValues)
const meldInnEndringDispatch = createContext({} as MeldInnEndringDispatcher)

const ProvideMeldInnEndringContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const [meldInnEndring, setMeldInnEndring] = useState<MeldtInnEndring>(meldInnEndringDefaultValues)

    const dispatcher: MeldInnEndringDispatcher = {
        setMeldInnEndring,
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
