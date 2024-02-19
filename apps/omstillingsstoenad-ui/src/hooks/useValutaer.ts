import { useEffect, useState } from 'react'
import { hentValutaer } from '../api/api'
import { useError } from './useError'
import { useTranslation } from 'react-i18next'

interface UseLand {
    valutaer: Options[]
}

interface Options {
    label?: string | undefined
    value: string
}

interface Land {
    gyldigFra: string
    gyldigTil: string
    beskrivelser: {
        nb: {
            term: string
            tekst: string
        }
    }
}

const sortByTekst = (a: Land, b: Land) => {
    if (a.beskrivelser.nb.tekst > b.beskrivelser.nb.tekst) {
        return 1
    }
    return -1
}

export const moveMostUsedCountriesToBeginning = (allCountries: Land[]) => {
    const frequentlyUsed = ['NORGE']

    const countries = allCountries.filter((country) => frequentlyUsed.includes(country.beskrivelser.nb.tekst))

    if (countries) countries.forEach((country) => allCountries.unshift(country))

    return allCountries
}

export const useValutaer = (): UseLand => {
    const [valutaer, setValutaer] = useState<Land[]>([])
    const { setError } = useError()
    const { t } = useTranslation()

    useEffect(() => {
        ;(async () => {
            try {
                let landliste: Land[] = await hentValutaer()
                landliste = landliste.sort(sortByTekst)
                setValutaer(moveMostUsedCountriesToBeginning(landliste))

                landliste = landliste.filter((land) => new Date(land.gyldigTil) > new Date())
                setValutaer(landliste)
            } catch (e) {
                console.log(e)
                setError('Klarte ikke å hente landene')
            }
        })()
    }, [])

    const optionsListe = (land: Land[]): Options[] => {
        const landliste = land.map((l) => {
            const str = l.beskrivelser['nb'].tekst.toLowerCase()
            const tekst = str.charAt(0).toUpperCase() + str.slice(1)
            return {
                label: tekst,
                value: tekst,
            }
        })

        landliste.unshift({
            label: t('felles.velgLand'),
            value: t(''),
        })
        return landliste
    }
    return { valutaer: optionsListe(valutaer) }
}

useEffect(() => {
    ;(async () => {
        try {
            const valutaer = await hentValutaer()
            console.log(valutaer)
        } catch (e) {
            console.log(e)
        }
    })()
}, [])
