import { useEffect, useState } from 'react'
import { getAllCountries } from '../api/api'
import useTranslation from './useTranslation'

interface UseCountries {
    countries: Options[]
    allCountries: Options[]
}
interface Options {
    label?: string | undefined
    value: string
}

interface Country {
    gyldigFra: string
    gyldigTil: string
    beskrivelser: {
        nb: {
            term: string
            tekst: string
        }
    }
}

export default function useCountries(): UseCountries {
    const { t } = useTranslation('felles')

    const [countries, setCountries] = useState<Country[]>([])
    const [allCountries, setAllCountries] = useState<Country[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                const allCountries = ((await getAllCountries()) as Country[]).sort()
                setAllCountries(allCountries)

                const validCountries = allCountries.filter((land) => new Date(land.gyldigTil) > new Date())
                setCountries(validCountries)
            } catch (e) {
                console.log(e)
                // TODO: Navigate to error page
            }
        })()
    }, [])

    const optionsListe = (countries: Country[]): Options[] => {
        const landliste = countries.map((l) => {
            const str = l.beskrivelser['nb'].tekst.toLowerCase()
            const text = str.charAt(0).toUpperCase() + str.slice(1)
            return {
                label: text,
                value: text,
            }
        })

        landliste.unshift({
            label: t('velgLand'),
            value: t(''),
        })
        return landliste
    }

    return { countries: optionsListe(countries), allCountries: optionsListe(allCountries) }
}
