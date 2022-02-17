import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Banner from './components/common/Banner'
import useLoggedInUser from './hooks/useLoggedInUser'
import { ContentContainer } from '@navikt/ds-react'
import styled from 'styled-components'
import FrontPage from './components/FrontPage'
import ScenarioSelection from './components/application/scenario/ScenarioSelection'
import Dialogue from './components/application/Dialogue'
import { ChildApplicantSteps, GuardianApplicantSteps, ParentApplicantSteps } from './utils/steps'

const SoeknadWrapper = styled(ContentContainer)`
    div,
    label,
    legend,
    span,
    p {
        font-size: 16px;
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
    useLoggedInUser()

    return (
        <>
            <Banner tekst={'Søknad om barnepensjon'} />

            <SoeknadWrapper>
                <Routes>
                    <Route index element={<FrontPage />} />

                    <Route path="velg-scenarie" element={<ScenarioSelection />} />

                    <Route
                        path="/skjema/verge/*"
                        element={<Dialogue steps={GuardianApplicantSteps} pathPrefix={'/skjema/verge/'} />}
                    />
                    <Route
                        path="/skjema/barn/*"
                        element={<Dialogue steps={ChildApplicantSteps} pathPrefix={'/skjema/barn/'} />}
                    />
                    <Route
                        path="/skjema/forelder/*"
                        element={<Dialogue steps={ParentApplicantSteps} pathPrefix={'/skjema/forelder/'} />}
                    />

                    <Route path="*" element={<h1>404</h1>} />
                </Routes>
            </SoeknadWrapper>
        </>
    )
}
