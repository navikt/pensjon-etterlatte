import React from 'react'
import { UserProvider } from './user/UserContext'
import { LanguageProvider } from './language/LanguageContext'
import { FCProps } from '../types/FCProps'

const ContextProviders: React.FC<FCProps> = ({ children }) => {
    return (
        <LanguageProvider>
                <UserProvider>{children}</UserProvider>
        </LanguageProvider>
    )
}

export default ContextProviders
