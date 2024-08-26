import { useEffect, useState } from 'react'
import { getAllCountries } from '../api/api'

interface UseCountries {
    countries: Options[]
    allCountries: Options[]
}
export interface Options {
    label: string
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

export const moveNorwayToBeginning = (allCountries: Country[]) => {
    const norway = allCountries.find((country) => country.beskrivelser.nb.tekst === 'NORGE')

    const norwayRemoved = [...allCountries].filter((country) => country.beskrivelser.nb.tekst !== 'NORGE')

    if (norway) norwayRemoved.unshift(norway)

    return norwayRemoved
}

export default function useCountries(): UseCountries {
    const [countries, setCountries] = useState<Country[]>([])
    const [allCountries, setAllCountries] = useState<Country[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                const allCountries = await getAllCountries()
                allCountries.sort((a: Country, b: Country) =>
                    a.beskrivelser.nb.term > b.beskrivelser.nb.term ? 1 : -1
                )

                const unknownCountriesRemoved = allCountries.filter(
                    (country: Country) => !country.beskrivelser.nb.term.toLowerCase().includes('uoppgitt')
                )

                setAllCountries(unknownCountriesRemoved)

                const validCountries = unknownCountriesRemoved.filter(
                    (land: Country) => new Date(land.gyldigTil) > new Date()
                )
                setCountries(moveNorwayToBeginning(validCountries))
            } catch (e) {
                console.log(e)
                // TODO: Navigate to error page
            }
        })()
    }, [])

    const optionsListe = (countries: Country[]): Options[] => {
        const landliste = countries.map((l) => {
            const str = l.beskrivelser['nb'].term.toLowerCase()
            const text = str.charAt(0).toUpperCase() + str.slice(1)
            return {
                label: text,
                value: text,
            }
        })

        return landliste
    }

    return { countries: optionsListe(countries), allCountries: optionsListe(allCountries) }
}
