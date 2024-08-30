export const apiURL = import.meta.env.DEV
    ? `http://localhost:8080${import.meta.env.BASE_URL}/api`
    : `${import.meta.env.BASE_URL}/api`

export const sanityURL = import.meta.env.DEV
    ? `http://localhost:8080${import.meta.env.BASE_URL}/brukerdialog-sanity`
    : `${import.meta.env.BASE_URL}/brukerdialog-sanity`

export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const poster = <T>(url: string, { arg }: { arg: T }) =>
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(arg) })
