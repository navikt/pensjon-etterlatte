import { useEffect } from 'react'
import i18next from '../i18n'
import { useSoknadContext } from '../context/soknad/SoknadContext'
import { useCookies } from 'react-cookie'
import { setParams } from '@navikt/nav-dekoratoren-moduler'

const dekoratorLanguageCookieName = 'decorator-language'

export const useLanguage = () => {
    const { state: soeknadState } = useSoknadContext()
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName])
    const { [dekoratorLanguageCookieName]: dekoratørSpraak } = cookies

    useEffect(() => {
        i18next.changeLanguage(soeknadState.spraak, (err, t) => {
            if (err) return console.log('something went wrong loading', err)
            t('key')
        })
        setParams({ language: soeknadState.spraak }).then()
        setCookie(dekoratorLanguageCookieName, soeknadState.spraak)
    }, [soeknadState.spraak])

    useEffect(() => {
        if (!dekoratørSpraak) setCookie(dekoratorLanguageCookieName, soeknadState.spraak)
    }, [])
}
