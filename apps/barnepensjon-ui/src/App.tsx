import { Page } from '@navikt/ds-react'
import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import ErrorBoundary from '~ErrorBoundary'
import Dialogue from './components/application/Dialogue'
import ReceiptPage from './components/application/ReceiptPage'
import { ContinueApplicationModal } from './components/common/ContinueApplicationModal'
import { InvalidApplicant } from './components/error/InvalidApplicant'
import PageNotFound from './components/error/PageNotFound'
import SystemUnavailable from './components/error/SystemUnavailable'
import FrontPage from './components/FrontPage'
import useApplication from './hooks/useApplication'
import useLoggedInUser from './hooks/useLoggedInUser'
import useScrollToTop from './hooks/useScrollToTop'
import { ChildApplicantSteps, GuardianApplicantSteps, ParentApplicantSteps, StepPrefix } from './utils/steps'
import './app.css'
import { ApplicationTitle } from '~components/common/ApplicationTitle'
import { PageLoading } from '~components/common/PageLoading'

export default function App() {
    const isLoading = useApplication()

    useLoggedInUser()
    useScrollToTop()

    return (
        <ErrorBoundary>
            <>
                <ApplicationTitle />

                {isLoading ? (
                    <PageLoading />
                ) : (
                    <>
                        <ContinueApplicationModal />
                        <Page>
                            <Page.Block className="soeknad-page-block">
                                <Routes>
                                    <Route index element={<FrontPage />} />

                                    <Route path="/skjema" element={<Outlet />}>
                                        <Route
                                            path={`${StepPrefix.GUARDIAN}/*`}
                                            element={
                                                <Dialogue
                                                    steps={GuardianApplicantSteps}
                                                    pathPrefix={'/skjema/verge/'}
                                                />
                                            }
                                        />
                                        <Route
                                            path={`${StepPrefix.Child}/*`}
                                            element={
                                                <Dialogue steps={ChildApplicantSteps} pathPrefix={'/skjema/barn/'} />
                                            }
                                        />
                                        <Route
                                            path={`${StepPrefix.Parent}/*`}
                                            element={
                                                <Dialogue
                                                    steps={ParentApplicantSteps}
                                                    pathPrefix={'/skjema/forelder/'}
                                                />
                                            }
                                        />

                                        <Route path="kvittering" element={<ReceiptPage />} />
                                    </Route>

                                    <Route path={'/ugyldig-soeker'} element={<InvalidApplicant />} />

                                    <Route path={'/system-utilgjengelig'} element={<SystemUnavailable />} />

                                    <Route path="*" element={<PageNotFound />} />
                                </Routes>
                            </Page.Block>
                        </Page>
                    </>
                )}
            </>
        </ErrorBoundary>
    )
}
