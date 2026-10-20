import { FC } from 'react'
import { SoknadProvider } from './soknad/SoknadContext'
import { BrukerProvider } from './bruker/BrukerContext'
import { FCProps } from '../typer/FCProps'
import { ProvideFeatureToggleContext } from '~context/featureToggle/FeatureToggleContext'

const ContextProviders: FC<FCProps> = ({ children }) => {
    return (
            <ProvideFeatureToggleContext>
                <SoknadProvider>
                    <BrukerProvider>{children}</BrukerProvider>
                </SoknadProvider>
            </ProvideFeatureToggleContext>
    )
}

export default ContextProviders
