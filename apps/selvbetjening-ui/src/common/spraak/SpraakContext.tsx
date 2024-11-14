import { createContext, ReactNode, useContext, useState } from 'react'
import { hentSpraakFraLocalStorage, lagreSpraakILocalStorage } from './localStorage.ts'
import { Spraak } from './spraak.ts'

interface SpraakDispatcher {
    setSpraak: (spraak: Spraak) => void
}

const spraakContext = createContext(hentSpraakFraLocalStorage())
const spraakDispatch = createContext({} as SpraakDispatcher)

const ProvideSpraakContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const [state, setState] = useState<Spraak>(hentSpraakFraLocalStorage())

    const dispatcher: SpraakDispatcher = {
        setSpraak: (spraak) => {
            lagreSpraakILocalStorage(spraak)
            setState(spraak)
        },
    }

    return (
        <spraakContext.Provider value={state}>
            <spraakDispatch.Provider value={dispatcher}>{children}</spraakDispatch.Provider>
        </spraakContext.Provider>
    )
}

const useSpraak = (): Spraak => {
    return useContext(spraakContext)
}

const useSpraakDispatch = (): SpraakDispatcher => {
    return useContext(spraakDispatch)
}

export { ProvideSpraakContext, useSpraak, useSpraakDispatch }
