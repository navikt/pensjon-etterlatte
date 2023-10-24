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

export const moveMostUsedCountriesToBeginning = (allCountries: Country[]) => {
    const countryStrings = ['NORGE', 'DANMARK', 'SVERIGE', 'POLEN'].reverse()

    countryStrings.forEach((countryString) => {
        const country = allCountries.find(country => country.beskrivelser.nb.tekst === countryString)
        if (country) {
            const countryIndex = allCountries.findIndex((allCountry) => allCountry === country)
            allCountries.splice(countryIndex, 1)
            allCountries.unshift(country)
        }
    })

    return allCountries
}

export default function useCountries(): UseCountries {
    const { t } = useTranslation('common')

    const [countries, setCountries] = useState<Country[]>([])
    const [allCountries, setAllCountries] = useState<Country[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                const allCountries = await getAllCountries()
                allCountries.sort((a: Country, b: Country) =>
                    a.beskrivelser.nb.tekst > b.beskrivelser.nb.tekst ? 1 : -1
                )

                setAllCountries(moveMostUsedCountriesToBeginning(allCountries))

                const validCountries = allCountries.filter((land: Country) => new Date(land.gyldigTil) > new Date())
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
            label: t('chooseCountry'),
            value: t(''),
        })
        return landliste
    }

    return { countries: optionsListe(countries), allCountries: optionsListe(allCountries) }
}
