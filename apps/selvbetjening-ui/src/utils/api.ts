export const apiURL = import.meta.env.DEV
    ? `http://localhost:8080${import.meta.env.BASE_URL}/api`
    : `${import.meta.env.BASE_URL}/api`

export class ApiError extends Error {
    status

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

export const fetcher = async (url: string) => {
    const res = await fetch(url)

    const status = res.status

    if (![200, 304].includes(status)) {
        throw new ApiError(`Feil i henting av data: ${await res.text()}`, status)
    }

    return res.json()
}

export const poster = <T>(url: string, { body }: { body: T }) =>
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
