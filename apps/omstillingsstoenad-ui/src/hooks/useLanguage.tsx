import { setParams } from '@navikt/nav-dekoratoren-moduler'
import { useEffect } from 'react'
import { useSoknadContext } from '../context/soknad/SoknadContext'
import i18next from '../i18n'

export const useLanguage = () => {
    const { state: soeknadState } = useSoknadContext()

    useEffect(() => {
        i18next.changeLanguage(soeknadState.spraak, (err, t) => {
            if (err) return console.log('something went wrong loading', err)
            t('key')
        })
        setParams({ language: soeknadState.spraak }).then()
    }, [soeknadState.spraak])
}
