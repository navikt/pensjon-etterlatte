import { useEffect, useState } from 'react'
import { hentLand } from '../api/api'
import { useError } from './useError'
import { useTranslation } from 'react-i18next'

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
    const { setError } = useError()
    const { t } = useTranslation()

    useEffect(() => {
        (async () => {
            try {
                let landliste: Land[] = await hentLand()
                landliste = landliste.sort(sortByTekst)
                setAlleLand(landliste)

                landliste = landliste.filter((land) => new Date(land.gyldigTil) > new Date())
                setLand(landliste)
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
    return { land: optionsListe(land), alleLand: optionsListe(alleLand) }
}
