import React, { useEffect, useState } from "react"
import Banner from "./components/common/Banner";
import { useBrukerContext } from "./context/bruker/BrukerContext"
import { ActionTypes } from "./context/bruker/bruker"

const isDev = process.env.NODE_ENV === "development";

const baseUrl = isDev
        ? `http://localhost:8080${process.env.PUBLIC_URL}`
        : "/barnepensjon/soknad";

const App = () => {
    const { state, dispatch } = useBrukerContext()
    const [error, setError] = useState<any>()

    useEffect(() => {
        fetch(`${baseUrl}/api/person/innlogget`)
                .then(res => res.json())
                .then(
                        (result) => dispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: result }),
                        (error) => setError(error)
                )
                .catch(err => console.log(err))
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
