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
    isoKode: string
    gyldigFra: string
    gyldigTil: string
    beskrivelse: {
        term: string
        tekst: string
    }
}

const sortByTekst = (a: Valuta, b: Valuta) => {
    if (a.beskrivelse.tekst > b.beskrivelse.tekst) {
        return 1
    }
    return -1
}

export const moveMostUsedCurrenciesToBeginning = (currencies: Valuta[]) => {
    const frequentlyUsed = ['SEK', 'NOK', 'EUR']

    const frequentlyUsedCurrencies = currencies.filter((valuta) => frequentlyUsed.includes(valuta.isoKode))

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
        const valutaListe = valuta.map((valuta) => {
            const tekst = valuta.beskrivelse.tekst + ' (' + valuta.isoKode + ')'
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
