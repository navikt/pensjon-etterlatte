import React, { useEffect, useState } from "react"
import Banner from "./components/common/Banner";
import { useBrukerContext } from "./context/bruker/BrukerContext"
import { ActionTypes, IBruker } from "./context/bruker/bruker"
import { hentInnloggetPerson } from "./api/api"

const App = () => {
    const {state, dispatch} = useBrukerContext()
    const [error, setError] = useState<any>()

    useEffect(() => {
        hentInnloggetPerson()
                .then((person: IBruker) => {
                    dispatch({type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: person})
                })
                .catch(err => {
                    setError(err)
                })
    }, [])

    return (
            <div>
                <Banner tekst={"Søknad om barnepensjon"} />

                <div>
                    <pre>{state && JSON.stringify(state)}</pre>
                </div>
                <div>
                    <pre>{error && JSON.stringify(error)}</pre>
                </div>
            </div>
    )
}

export default App
