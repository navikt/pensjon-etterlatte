import { FC } from 'react'
import { SoeknadProvider } from './soeknad/SoeknadContext'
import { BrukerProvider } from './bruker/BrukerContext'

const ContextProviders: FC = ({ children }) => {
    return (
        <SoeknadProvider>
            <BrukerProvider>{children}</BrukerProvider>
        </SoeknadProvider>
    )
}

export default ContextProviders
