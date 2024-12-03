import { Inntekt, inntektDefaultValues } from '../../types/inntektsjustering.ts'
import { createContext, ReactNode, useContext, useState } from 'react'
import { isAfter } from 'date-fns'
import { InntektSkjemaLukket } from '../InntektSkjemaLukket.tsx'

interface InntektDispatcher {
    setInntekt: (inntekt: Inntekt) => void
}

const inntektContext = createContext(inntektDefaultValues)
const inntektDispatch = createContext({} as InntektDispatcher)

const ProvideInntektContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const [inntekt, setInntekt] = useState<Inntekt>(inntektDefaultValues)

    const dispatcher: InntektDispatcher = {
        setInntekt,
    }

    // Hvis dagen i dag er etter 1. Januar, ikke la bruker gå videre i skjemaet
    if (isAfter(new Date(), new Date(new Date().getFullYear(), 0, 1, 4))) {
        return <InntektSkjemaLukket />
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
