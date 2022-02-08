import React from 'react'
import { Route, Routes } from 'react-router'
import Banner from './components/common/Banner'
import useLoggedInUser from './hooks/useLoggedInUser'
import Forside from './components/Forside'
import { ContentContainer } from '@navikt/ds-react'
import styled from 'styled-components'
import VelgScenarie from './components/soeknad/1-velg-scenarie/VelgScenarie'

const Soeknad = styled.div`
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

const App = () => {
    useLoggedInUser()

    return (
        <>
            <Banner tekst={'Søknad om barnepensjon'} />

            <ContentContainer>
                <Soeknad>
                    <Routes>
                        <Route caseSensitive path={'/'} element={<Forside />} />
                        <Route caseSensitive path={'/skjema/steg/velg-scenarie'} element={<VelgScenarie />} />
                    </Routes>
                </Soeknad>
            </ContentContainer>
        </>
    )
}

export default App
