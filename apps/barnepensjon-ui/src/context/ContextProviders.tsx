import React from 'react'
import { FCProps } from '../types/FCProps'
import { ApplicationProvider } from './application/ApplicationContext'
import { LanguageProvider } from './language/LanguageContext'
import { UserProvider } from './user/UserContext'

const ContextProviders: React.FC<FCProps> = ({ children }) => {
    return (
        <LanguageProvider>
            <ApplicationProvider>
                <UserProvider>{children}</UserProvider>
            </ApplicationProvider>
        </LanguageProvider>
    )
}

export default ContextProviders
