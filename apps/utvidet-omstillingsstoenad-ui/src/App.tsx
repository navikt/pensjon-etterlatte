import { Page } from '@navikt/ds-react'
import { Navigate, Route, Routes } from 'react-router'
import { GlobalErrorAlert } from '~components/felles/globalErrorAlert/GlobalErrorAlert'
import { SideLaster } from '~components/felles/SideLaster'
import { SkjemaTittel } from '~components/felles/SkjemaTittel'
import SystemUtilgjengelig from './components/felles/systemUtilgjengelig/SystemUtilgjengelig'
import SideIkkeFunnet from './components/SideIkkeFunnet'
import { FortsettSoeknadModal } from './components/soknad/FortsettSoeknadModal'
import { soeknadStegRuter } from './components/soknad/SoeknadStegRuter'
import SoknadForside from './components/soknad/SoknadForside'
import SoknadKvittering from './components/soknad/SoknadKvittering'
import UgyldigSoeker from './components/UgyldigSoeker'
import { useSoknadContext } from './context/soknad/SoknadContext'
import { useAnalytics } from './hooks/useAnalytics'
import useInnloggetBruker from './hooks/useInnloggetBruker'
import useSoeknad from './hooks/useSoeknad'

const App = () => {
    useInnloggetBruker()
    useAnalytics()
    const { state } = useSoknadContext()
    const lasterSoeknad = useSoeknad()

    return (
        <>
            <SkjemaTittel />

            {lasterSoeknad ? (
                <SideLaster />
            ) : (
                <>
                    <FortsettSoeknadModal />

                    <Page>
                        <Page.Block className="soeknad-page-block" role="main" width="xl">
                            <Routes>
                                <Route index path={'/'} element={<SoknadForside />} />

                                {soeknadStegRuter()}

                                <Route path={'/skjema/sendt'} element={<SoknadKvittering />} />

                                <Route path={'/ugyldig-alder'} element={<UgyldigSoeker />} />

                                <Route path={'/system-utilgjengelig'} element={<SystemUtilgjengelig />} />

                                <Route path={'/labs'} element={<Navigate replace to="/skjema/admin" />} />

                                <Route path={'*'} element={<SideIkkeFunnet />} />
                            </Routes>
                            {state.error && <GlobalErrorAlert message={state.error} />}
                        </Page.Block>
                    </Page>
                </>
            )}
        </>
    )
}

export default App
