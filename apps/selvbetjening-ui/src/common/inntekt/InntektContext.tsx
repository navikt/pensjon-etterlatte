import { Inntekt, inntektDefaultValues } from '../../types/inntektsjustering.ts'
import { createContext, ReactNode, useContext, useState } from 'react'

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
