import { Route, Routes } from 'react-router'
import { BrukerProvider } from '~context/bruker/BrukerContext'
import { SoknadProvider } from '~context/soknad/SoknadContext'
import { Soknad } from '~Soknad'
import { UtvidetSoknad } from '~UtvidetSoknad'
import { useAnalytics } from './hooks/useAnalytics'

const App = () => {
    useAnalytics()

    return (
        <Routes>
            <Route index path={'/utvidet'} element={<UtvidetSoknad />} />
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
