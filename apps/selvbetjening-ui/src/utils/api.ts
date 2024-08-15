export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const poster = <T>(url: string, { arg }: { arg: T }) =>
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(arg) })
