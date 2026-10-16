import { Route, Routes } from 'react-router'
import { BrukerProvider } from '~context/bruker/BrukerContext'
import { SoknadProvider } from '~context/soknad/SoknadContext'
import { HentBrukerProvider } from '~context/utvidet/HentBrukerContext'
import { useAnalytics } from '~hooks/useAnalytics'
import { Soknad } from '~Soknad'
import { UtvidetSoknad } from '~UtvidetSoknad'

const App = () => {
    useAnalytics()

    return (
        <Routes>
            <Route
                index
                path={'/utvidet'}
                element={
                    <HentBrukerProvider>
                        <UtvidetSoknad />
                    </HentBrukerProvider>
                }
            />
            <Route
                index
                path={'*'}
                element={
                    <SoknadProvider>
                        <BrukerProvider>
                            <Soknad />
                        </BrukerProvider>
                    </SoknadProvider>
                }
            />
        </Routes>
    )
}

export default App
