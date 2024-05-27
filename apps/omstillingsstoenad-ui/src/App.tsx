import {Navigate, Outlet, Route, Routes} from 'react-router'
import SideIkkeFunnet from './components/SideIkkeFunnet'
import Banner from './components/felles/Banner'
import UgyldigSoeker from './components/UgyldigSoeker'
import {Alert, Page} from '@navikt/ds-react'
import useInnloggetBruker from './hooks/useInnloggetBruker'
import { useAmplitude } from './utils/amplitude'
import { useSoknadContext } from './context/soknad/SoknadContext'
import { useTranslation } from 'react-i18next'
import SystemUtilgjengelig from './components/SystemUtilgjengelig'
import styled from 'styled-components'
import useSoeknad from './hooks/useSoeknad'
import LoaderOverlay from './components/felles/LoaderOverlay'
import { FortsettSoeknadModal } from './components/soknad/FortsettSoeknadModal'
import Admin from './components/dev/Admin'
import SoknadDialog from './components/soknad/SoknadDialog'
import SoknadKvittering from './components/soknad/SoknadKvittering'
import SoknadForside from './components/soknad/SoknadForside'
import {Vedlikehold} from "./Vedlikehold";

const SoeknadWrapper = styled(Page.Block)`
    div,
    label,
    legend,
    span,
    p {
        font-size: 16px;
    }

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
    useAmplitude()
    const { t } = useTranslation()

    const lasterSoeknad = useSoeknad()

    return (
        <>
            <Banner tekst={t('banner.tittel')} />

            <LoaderOverlay visible={lasterSoeknad} label={'Henter søknadsinformasjon ...'} />
            {!lasterSoeknad && <FortsettSoeknadModal />}
            <Vedlikehold />
            <Page>
                <SoeknadWrapper role="main" width="xl">
                    <Routes>
                        <Route index path={'/'} element={<SoknadForside />} />

                        <Route path={'skjema'} element={<Outlet />}>
                            <Route path={'steg/*'} element={<SoknadDialog />} />
                        </Route>

                        <Route path={'/skjema/admin'} element={<Admin />} />

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
