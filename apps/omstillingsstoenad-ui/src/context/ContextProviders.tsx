import { FC } from 'react'
import { SoknadProvider } from './soknad/SoknadContext'
import { BrukerProvider } from './bruker/BrukerContext'
import { FCProps } from '../typer/FCProps'

const ContextProviders: FC<FCProps> = ({ children }) => {
    return (
        <SoknadProvider>
            <BrukerProvider>{children}</BrukerProvider>
        </SoknadProvider>
    )
}

export default ContextProviders
