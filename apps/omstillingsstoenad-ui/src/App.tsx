import { Alert, Page } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import styled from 'styled-components'
import Banner from './components/felles/Banner'
import LoaderOverlay from './components/felles/LoaderOverlay'
import SideIkkeFunnet from './components/SideIkkeFunnet'
import SystemUtilgjengelig from './components/SystemUtilgjengelig'
import { FortsettSoeknadModal } from './components/soknad/FortsettSoeknadModal'
import SoknadDialog from './components/soknad/SoknadDialog'
import SoknadForside from './components/soknad/SoknadForside'
import SoknadKvittering from './components/soknad/SoknadKvittering'
import UgyldigSoeker from './components/UgyldigSoeker'
import { useSoknadContext } from './context/soknad/SoknadContext'
import { useAnalytics } from './hooks/useAnalytics'
import useInnloggetBruker from './hooks/useInnloggetBruker'
import useSoeknad from './hooks/useSoeknad'

const SoeknadWrapper = styled(Page.Block)`
    .navds-step-indicator {
        justify-content: center;
    }

    @media screen and (max-width: 650px) {
        padding: 1rem;
        margin: 0 auto;
        max-width: 100%;
        white-space: pre-line;
    }

    @media screen and (min-width: 650px) {
        padding: 2rem;
        margin: 0 auto;
        max-width: 650px !important;
        white-space: pre-line;
    }
`

const GlobalAlertWrap = styled.div`
    position: fixed;
    bottom: 2em;
    left: 1em;
    right: 1em;
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
`

const App = () => {
    useInnloggetBruker()
    const soknadContext = useSoknadContext()
    useAnalytics()
    const { t } = useTranslation()

    const lasterSoeknad = useSoeknad()

    return (
        <>
            <Banner tekst={t('banner.tittel')} />

            <LoaderOverlay visible={lasterSoeknad} label={'Henter søknadsinformasjon ...'} />
            {!lasterSoeknad && <FortsettSoeknadModal />}

            <Page>
                <SoeknadWrapper role="main" width="xl">
                    <Routes>
                        <Route index path={'/'} element={<SoknadForside />} />

                        <Route path={'skjema'} element={<Outlet />}>
                            <Route path={'steg/*'} element={<SoknadDialog />} />
                        </Route>

                        <Route path={'/skjema/sendt'} element={<SoknadKvittering />} />

                        <Route path={'/ugyldig-alder'} element={<UgyldigSoeker />} />

                        <Route path={'/system-utilgjengelig'} element={<SystemUtilgjengelig />} />

                        <Route path={'/labs'} element={<Navigate replace to="/skjema/admin" />} />

                        <Route path={'*'} element={<SideIkkeFunnet />} />
                    </Routes>
                    {soknadContext?.state?.error && (
                        <GlobalAlertWrap>
                            <Alert variant="error">{soknadContext?.state?.error}</Alert>
                        </GlobalAlertWrap>
                    )}
                </SoeknadWrapper>
            </Page>
        </>
    )
}

export default App
