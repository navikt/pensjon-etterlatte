import { ContentContainer } from '@navikt/ds-react'
import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Dialogue from './components/application/Dialogue'
import ReceiptPage from './components/application/ReceiptPage'
import Banner from './components/common/Banner'
import SpinnerOverlay from './components/common/SpinnerOverlay'
import Admin from './components/dev/Admin'
import PageNotFound from './components/error/PageNotFound'
import SystemUnavailable from './components/error/SystemUnavailable'
import FrontPage from './components/FrontPage'
import useApplication from './hooks/useApplication'
import useLoggedInUser from './hooks/useLoggedInUser'
import { ChildApplicantSteps, GuardianApplicantSteps, ParentApplicantSteps, StepPrefix } from './utils/steps'
import useScrollToTop from './hooks/useScrollToTop'
import { ContinueApplicationModal } from './components/common/ContinueApplicationModal'
import useTranslation from './hooks/useTranslation'
import { InvalidApplicant } from './components/error/InvalidApplicant'

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
    const { t } = useTranslation('app')

    useLoggedInUser()
    useScrollToTop()

    return (
        <>
            <Banner tekst={t('applicationTitle')} />

            <SpinnerOverlay visible={isLoading} label={t('fetchingApplicationDetails')} />
            <ContinueApplicationModal />

            <SoeknadWrapper>
                <Routes>
                    <Route index element={<FrontPage />} />

                    <Route path="/skjema" element={<Outlet />}>
                        <Route
                            path={`${StepPrefix.GUARDIAN}/*`}
                            element={<Dialogue steps={GuardianApplicantSteps} pathPrefix={'/skjema/verge/'} />}
                        />
                        <Route
                            path={`${StepPrefix.Child}/*`}
                            element={<Dialogue steps={ChildApplicantSteps} pathPrefix={'/skjema/barn/'} />}
                        />
                        <Route
                            path={`${StepPrefix.Parent}/*`}
                            element={<Dialogue steps={ParentApplicantSteps} pathPrefix={'/skjema/forelder/'} />}
                        />

                        <Route path="admin" element={<Admin />} />

                        <Route path="kvittering" element={<ReceiptPage />} />
                    </Route>

                    <Route path={'/ugyldig-soeker'} element={<InvalidApplicant />} />

                    <Route path={'/system-utilgjengelig'} element={<SystemUnavailable />} />

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </SoeknadWrapper>
        </>
    )
}
