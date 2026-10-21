import { FC } from 'react'
import { ProvideFeatureToggleContext } from '~context/featureToggle/FeatureToggleContext'
import { FCProps } from '../typer/FCProps'
import { BrukerProvider } from './bruker/BrukerContext'
import { SoknadProvider } from './soknad/SoknadContext'

const ContextProviders: FC<FCProps> = ({ children }) => (
    <ProvideFeatureToggleContext>
        <SoknadProvider>
            <BrukerProvider>{children}</BrukerProvider>
        </SoknadProvider>
    </ProvideFeatureToggleContext>
)

export default ContextProviders
