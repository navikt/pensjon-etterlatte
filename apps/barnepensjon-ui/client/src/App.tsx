import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Banner from './components/common/Banner'
import useLoggedInUser from './hooks/useLoggedInUser'
import Forside from './components/Forside'
import { ContentContainer } from '@navikt/ds-react'
import styled from 'styled-components'
import VelgScenarie from './components/soeknad/1-velg-scenarie/VelgScenarie'
import OmDeg from './components/soeknad/2-om-deg/OmDeg'

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
                        <Route path={'/skjema/steg/velg-scenarie'} element={<VelgScenarie />} />
                        <Route path={'/skjema/steg/om-deg'} element={<OmDeg />} />

                        <Route caseSensitive path={'/'} element={<Forside />} />
                    </Routes>
                </Soeknad>
            </ContentContainer>
        </>
    )
}

export default App
