import React from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Banner from './components/common/Banner'
import PageNotFound from './components/error/PageNotFound'
import SystemUnavailable from './components/error/SystemUnavailable'
import FrontPage from './components/FrontPage'
import useScrollToTop from './hooks/useScrollToTop'
import useTranslation from './hooks/useTranslation'
import { Page } from "@navikt/ds-react";
import Inntektsjustering from "./inntektsjustering/Inntektsjustering";

const SelvbetjeningWrapper = styled(Page.Block)`
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
    const { t } = useTranslation('app')

    // useLoggedInUser() TODO
    useScrollToTop()

    return (
        <>
            <Banner tekst={t('applicationTitle')} />

            <Page>
                <SelvbetjeningWrapper>
                    <Routes>
                        <Route index element={<FrontPage />} />
                        <Route path={'/inntektsjustering/*'} element={<Inntektsjustering />} />

                        <Route path={'/system-utilgjengelig'} element={<SystemUnavailable />} />

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </SelvbetjeningWrapper>
            </Page>
        </>
    )
}
