import { Spraak } from './spraak.ts'

const SPRAAK_KEY = 'spraak'

export const hentSpraakFraLocalStorage = (): Spraak => {
    try {
        const valgtSpraak: string | null = localStorage.getItem(SPRAAK_KEY)
        if (valgtSpraak) return valgtSpraak as Spraak
        else return Spraak.BOKMAAL
    } catch {
        return Spraak.BOKMAAL
    }
}

export const lagreSpraakILocalStorage = (spraakSomSkalLagres: Spraak) =>
    localStorage.setItem(SPRAAK_KEY, spraakSomSkalLagres)
