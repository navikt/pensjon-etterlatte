import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { hentInnloggetPerson } from '~api/api'
import { SoeknadType } from '~api/dto/InnsendtSoeknad'
import { IBruker } from '~context/bruker/bruker'

interface HentBrukerContext {
    bruker: IBruker | undefined
    lasterBruker: boolean
}

const HentBrukerContext = createContext<HentBrukerContext | undefined>(undefined)

export function HentBrukerProvider(props: PropsWithChildren) {
    const [lasterBruker, setLasterBruker] = useState(true)
    const [bruker, setBruker] = useState<IBruker | undefined>()

    useEffect(() => {
        hentInnloggetPerson(SoeknadType.UTVIDET_OMSTILLINGSSTOENAD).then((person: IBruker) => {
            setBruker(person)
            setLasterBruker(false)
        })
    }, [])

    return (
        <HentBrukerContext.Provider value={{ bruker: bruker, lasterBruker: lasterBruker }}>
            {props.children}
        </HentBrukerContext.Provider>
    )
}

export function useHentBrukerContext() {
    const context = useContext(HentBrukerContext)

    if (context === undefined) {
        throw new Error('useHentBrukerContext må brukes innenfor HentBrukerProvider')
    }

    return context
}
