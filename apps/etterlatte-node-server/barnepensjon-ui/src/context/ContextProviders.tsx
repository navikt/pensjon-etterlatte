import React from 'react'
import { ApplicationProvider } from './application/ApplicationContext'
import { UserProvider } from './user/UserContext'
import { LanguageProvider } from './language/LanguageContext'
import { FCProps } from '../types/FCProps'

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
