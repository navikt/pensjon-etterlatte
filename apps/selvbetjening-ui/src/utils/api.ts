export const apiURL = import.meta.env.DEV
    ? `http://localhost:8080${import.meta.env.BASE_URL}/api`
    : `${import.meta.env.BASE_URL}/api`

export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const poster = <T>(url: string, { body }: { body: T }) =>
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
