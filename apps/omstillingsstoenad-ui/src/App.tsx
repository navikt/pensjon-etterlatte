import { Route, Routes } from 'react-router'
import { Soknad } from '~Soknad'
import { UtvidetSoknad } from '~UtvidetSoknad'
import { useAnalytics } from './hooks/useAnalytics'
import useInnloggetBruker from './hooks/useInnloggetBruker'

const App = () => {
    useInnloggetBruker()
    useAnalytics()

    return (
        <Routes>
            <Route index path={'/utvidet'} element={<UtvidetSoknad />} />
            <Route index path={'*'} element={<Soknad />} />
        </Routes>
    )
}

export default App
