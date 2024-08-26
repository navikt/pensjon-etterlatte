export const apiBase = import.meta.env.DEV
    ? `http://localhost:8080${import.meta.env.BASE_URL}`
    : import.meta.env.BASE_URL

export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const poster = <T>(url: string, { arg }: { arg: T }) =>
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(arg) })
