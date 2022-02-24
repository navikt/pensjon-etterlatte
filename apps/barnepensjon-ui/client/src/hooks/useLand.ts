import { useEffect, useState } from 'react'
import { getAllCountries } from '../api/api'
import useTranslation from './useTranslation'

interface UseLand {
    land: Options[]
    alleLand: Options[]
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

export const useLand = (): UseLand => {
    const [land, setLand] = useState<Land[]>([])
    const [alleLand, setAlleLand] = useState<Land[]>([])
    const { t } = useTranslation('felles')

    useEffect(() => {
        ;(async () => {
            try {
                let landliste: Land[] = await getAllCountries()
                landliste = landliste.sort(sortByTekst)
                setAlleLand(landliste)

                landliste = landliste.filter((land) => new Date(land.gyldigTil) > new Date())
                setLand(landliste)
            } catch (e) {
                console.log(e)
                // TODO: Navigate to error page
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
            label: t('velgLand'),
            value: t(''),
        })
        return landliste
    }

    return { land: optionsListe(land), alleLand: optionsListe(alleLand) }
}
