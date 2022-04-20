import { FC } from 'react'
import { ApplicationProvider } from './application/ApplicationContext'
import { UserProvider } from './user/UserContext'
import { LanguageProvider } from './language/LanguageContext'

const ContextProviders: FC = ({ children }) => {
    return (
        <LanguageProvider>
            <ApplicationProvider>
                <UserProvider>{children}</UserProvider>
            </ApplicationProvider>
        </LanguageProvider>
    )
}

export default ContextProviders
