import { FC } from 'react'
import { SoeknadProvider } from './soeknad/SoeknadContext'
import { UserProvider } from './user/UserContext'
import { LanguageProvider } from './language/LanguageContext'

const ContextProviders: FC = ({ children }) => {
    return (
        <LanguageProvider>
            <SoeknadProvider>
                <UserProvider>{children}</UserProvider>
            </SoeknadProvider>
        </LanguageProvider>
    )
}

export default ContextProviders
