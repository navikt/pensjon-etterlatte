import React from 'react'
import { FCProps } from '../types/FCProps'
import { ApplicationProvider } from './application/ApplicationContext'
import { FeatureToggleProvider } from './featureToggle/FeatureToggleContext'
import { LanguageProvider } from './language/LanguageContext'
import { UserProvider } from './user/UserContext'

const ContextProviders: React.FC<FCProps> = ({ children }) => {
    return (
        <LanguageProvider>
            <FeatureToggleProvider>
                <ApplicationProvider>
                    <UserProvider>{children}</UserProvider>
                </ApplicationProvider>
            </FeatureToggleProvider>
        </LanguageProvider>
    )
}

export default ContextProviders
