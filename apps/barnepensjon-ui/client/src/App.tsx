import React, { useEffect, useState } from "react"

const isDev = process.env.NODE_ENV === "development";

const baseUrl = isDev
        ? `http://localhost:8080${process.env.PUBLIC_URL}`
        : "/barnepensjon/soknad";

const App = () => {
    const [innlogget, setInnlogget] = useState<any>()
    const [error, setError] = useState<any>()

    useEffect(() => {
        fetch(`${baseUrl}/api/person/innlogget`)
                .then(res => res.json())
                .then(
                        (result) => setInnlogget(result),
                        (error) => setError(error)
                )
                .catch(err => console.log(err))
    }, [])

    return (
            <div>
                <h1>barnepensjon</h1>

                <div>
                    <pre>{innlogget && JSON.stringify(innlogget)}</pre>
                </div>
                <div>
                    <pre>{error && JSON.stringify(error)}</pre>
                </div>
            </div>
    )
}

export default App
