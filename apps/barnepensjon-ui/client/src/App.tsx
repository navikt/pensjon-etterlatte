import { ContentContainer } from '@navikt/ds-react'
import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Dialogue from './components/application/Dialogue'
import ReceiptPage from './components/application/ReceiptPage'
import ScenarioSelection from './components/application/scenario/ScenarioSelection'
import Banner from './components/common/Banner'
import ExpiredSession from './components/common/ExpiredSession'
import SpinnerOverlay from './components/common/SpinnerOverlay'
import Admin from './components/dev/Admin'
import PageNotFound from './components/error/PageNotFound'
import SystemUnavailable from './components/error/SystemUnavailable'
import FrontPage from './components/FrontPage'
import useApplication from './hooks/useApplication'
import useLoggedInUser from './hooks/useLoggedInUser'
import { ChildApplicantSteps, GuardianApplicantSteps, ParentApplicantSteps } from './utils/steps'
import useScrollToTop from './hooks/useScrollToTop'

const SoeknadWrapper = styled(ContentContainer)`
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

export default function App() {
    const isLoading = useApplication()

    useLoggedInUser()
    useScrollToTop()

    return (
        <>
            <Banner tekst={'Søknad om barnepensjon'} />

            <SpinnerOverlay visible={isLoading} label={'Henter søknadsinformasjon ...'} />

            <SoeknadWrapper>
                <Routes>
                    <Route index element={<FrontPage />} />

                    <Route path="velg-scenarie" element={<ScenarioSelection />} />

                    <Route path="/skjema" element={<Outlet />}>
                        <Route
                            path="verge/*"
                            element={<Dialogue steps={GuardianApplicantSteps} pathPrefix={'/skjema/verge/'} />}
                        />
                        <Route
                            path="barn/*"
                            element={<Dialogue steps={ChildApplicantSteps} pathPrefix={'/skjema/barn/'} />}
                        />
                        <Route
                            path="forelder/*"
                            element={<Dialogue steps={ParentApplicantSteps} pathPrefix={'/skjema/forelder/'} />}
                        />

                        <Route path="admin" element={<Admin />} />

                        <Route path="kvittering" element={<ReceiptPage />} />
                    </Route>

                    <Route path={'/system-utilgjengelig'} element={<SystemUnavailable />} />

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </SoeknadWrapper>
            <ExpiredSession />
        </>
    )
}
