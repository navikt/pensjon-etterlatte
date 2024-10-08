/* eslint-disable react-refresh/only-export-components */

import { Inntekt, inntektDefaultValues } from '../../types/inntektsjustering.ts'
import { createContext, ReactNode, useContext, useState } from 'react'

interface InntektDispatcher {
    setInntekt: (inntekt: Inntekt) => void
}

// TODO: hente denne fra API når det er på plass
const inntektContext = createContext(inntektDefaultValues)
const inntektDispatch = createContext({} as InntektDispatcher)

const ProvideInntektContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    // TODO: hente denne fra API når det er på plass
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
