import { Page } from '@navikt/ds-react'
import { Route, Routes } from 'react-router'
import { SkjemaTittelUtvidet } from '~components/felles/SkjemaTittelUtvidet'
import { UtvidetForside } from '~components/utvidet/UtvidetForside'
import { useHentBrukerContext } from '~context/utvidet/HentBrukerContext'

export const UtvidetSoknad = () => {
    const { bruker, lasterBruker } = useHentBrukerContext()

    console.log('bruker', bruker)
    console.log('lasterBruker', lasterBruker)
    return (
        <>
            <SkjemaTittelUtvidet />
            <Page>
                <Page.Block className="soeknad-page-block" role="main" width="xl">
                    <Routes>
                        <Route index path={'/'} element={<UtvidetForside />} />
                    </Routes>
                </Page.Block>
            </Page>
        </>
    )
}
