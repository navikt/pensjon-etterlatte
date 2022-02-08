import { FC } from 'react'
import { SoeknadProvider } from './soeknad/SoeknadContext'
import { UserProvider } from './user/UserContext'

const ContextProviders: FC = ({ children }) => {
    return (
        <SoeknadProvider>
            <UserProvider>{children}</UserProvider>
        </SoeknadProvider>
    )
}

export default ContextProviders
