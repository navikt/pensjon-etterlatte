import { useEffect, useState } from 'react'
import { hentValutaer } from '../api/api'
import { useError } from './useError'
import { useTranslation } from 'react-i18next'

interface UseValutaer {
    valutaer: Options[]
}

interface Options {
    label?: string | undefined
    value: string
}

interface Valuta {
    label: {
        gyldigFra: string
        gyldigTil: string
        beskrivelser: {
            nb: {
                term: string
                tekst: string
            }
        }
    }
}

const sortByTekst = (a: Valuta, b: Valuta) => {
    if (Object.values(a)[0].beskrivelser.nb.tekst > Object.values(b)[0].beskrivelser.nb.tekst) {
        return 1
    }
    return -1
}

export const moveMostUsedCurrenciesToBeginning = (currencies: Valuta[]) => {
    const frequentlyUsed = ['SEK', 'NOK', 'EUR']

    const frequentlyUsedCurrencies = currencies.filter((valuta) => frequentlyUsed.includes(Object.keys(valuta)[0]))

    if (frequentlyUsedCurrencies) frequentlyUsedCurrencies.forEach((country) => currencies.unshift(country))

    return currencies
}

export const useValutaer = (): UseValutaer => {
    const [valutaer, setValutaer] = useState<Valuta[]>([])
    const { setError } = useError()
    const { t } = useTranslation()

    useEffect(() => {
        ;(async () => {
            try {
                let valutaListe: Valuta[] = await hentValutaer()
                valutaListe = valutaListe.sort(sortByTekst)
                setValutaer(moveMostUsedCurrenciesToBeginning(valutaListe))
            } catch (e) {
                console.log(e)
                setError('Klarte ikke å hente valuta')
            }
        })()
    }, [])

    const optionsListe = (valuta: Valuta[]): Options[] => {
        const valutaListe = valuta.map((valutaKey) => {
            const tekst = Object.values(valutaKey)[0].beskrivelser.nb.tekst + ' (' + Object.keys(valutaKey)[0] + ')'
            return {
                label: tekst,
                value: tekst,
            }
        })

        valutaListe.unshift({
            label: t('felles.velgValuta'),
            value: t(''),
        })
        return valutaListe
    }

    return { valutaer: optionsListe(valutaer) }
}
