import { onLanguageSelect, setAvailableLanguages, setParams } from '@navikt/nav-dekoratoren-moduler'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ActionTypes } from '../context/soknad/soknad'
import { useSoknadContext } from '../context/soknad/SoknadContext'
import i18next, { Language } from '../i18n'

export const useLanguage = () => {
    const { state: soeknadState, dispatch: soeknadDispatch } = useSoknadContext()
    const { pathname, search } = useLocation()

    useEffect(() => {
        const isNavNoDomain =
            window.location.hostname === 'nav.no' || window.location.hostname.endsWith('.nav.no')
        if (!isNavNoDomain) {
            console.error(
                'Språkvalg i dekoratøren krever URL på nav.no-domene, hopper over setAvailableLanguages'
            )
            return
        }

        const currentUrl = `${window.location.origin}${pathname}${search}`

        setAvailableLanguages([
            { locale: Language.NORSK_BOKMAAL, url: currentUrl, handleInApp: true },
            { locale: Language.NORSK_NYNORSK, url: currentUrl, handleInApp: true },
            { locale: Language.ENGELSK, url: currentUrl, handleInApp: true },
        ])

        return onLanguageSelect((language) => {
            const valgtSpraak = language.locale
            const spraak = Object.values(Language).find((verdi) => verdi === valgtSpraak)

            if (!spraak) {
                console.error('Ugyldig språkvalg fra dekoratøren:', valgtSpraak)
                return
            }

            soeknadDispatch({
                type: ActionTypes.OPPDATER_SPRAAK,
                payload: spraak,
            })
        })
    }, [soeknadDispatch, pathname, search])

    useEffect(() => {
        if (!soeknadState.spraak) return

        i18next.changeLanguage(soeknadState.spraak, (err) => {
            if (err) console.log('something went wrong loading', err)
        })
        setParams({ language: soeknadState.spraak })
    }, [soeknadState.spraak])
}
