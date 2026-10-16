import { setParams } from '@navikt/nav-dekoratoren-moduler'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SpraakvalgSelect } from '~components/felles/SpraakvalgSelect'
import { useHentBrukerContext } from '~context/utvidet/HentBrukerContext'
import i18next, { Language } from '../../i18n'

export const SpraakvalgUtvidet = () => {
    const { t } = useTranslation()
    const { bruker } = useHentBrukerContext()
    const [spraak, setSpraak] = useState<Language>(Language.NORSK_BOKMAAL)

    const erStoettetSpraak = (language?: string): language is Language =>
        Object.values<string>(Language).includes(language || '')

    const oppdaterSpraak = (language: Language) => {
        setSpraak(language)
        //TODO: trekke ut slik som i Spraakvalg??
        i18next.changeLanguage(language, (err, t) => {
            if (err) return console.log('something went wrong loading', err)
            t('key')
        })
        setParams({ language: language }).then()
    }

    useEffect(() => {
        const defaultSpraak = erStoettetSpraak(bruker?.spraak) ? bruker.spraak : Language.NORSK_BOKMAAL
        oppdaterSpraak(defaultSpraak)
    }, [bruker?.spraak])

    return <SpraakvalgSelect value={spraak} onChange={oppdaterSpraak} label={t('felles.spraakValg')} />
}
