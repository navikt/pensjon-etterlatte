import React, { useEffect, useState } from 'react'
import Banner from './components/common/Banner'
import { useBrukerContext } from './context/bruker/BrukerContext'
import useLoggedInUser from './hooks/useLoggedInUser'

const App = () => {
    useLoggedInUser()
    const { state } = useBrukerContext()

    return (
        <div>
            <Banner tekst={'Søknad om barnepensjon'} />

            <div>
                <pre>{state && JSON.stringify(state)}</pre>
            </div>
        </div>
    )
}

export default App
