import { Select } from '@navikt/ds-react'
import styled from 'styled-components'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { ActionTypes } from '../../context/application/application'
import { useLanguageContext } from '../../context/language/LanguageContext'
import { Language } from '../../context/language/language'
import { LogEvents, useAnalytics } from '../../hooks/useAnalytics'
import useTranslation from '../../hooks/useTranslation'

const SelectWrapper = styled.div`
    max-width: 200px;
    text-align: center;
    margin: 0 auto;
`

export default function LanguageSelect() {
    const { language, updateLanguage } = useLanguageContext()
    const { dispatch } = useApplicationContext()

    const { t } = useTranslation('common')
    const { logEvent } = useAnalytics()

    const update = (lang: Language) => {
        updateLanguage(lang)
        logEvent(LogEvents.CHANGE_LANGUAGE, { type: lang })
        dispatch({ type: ActionTypes.UPDATE_LANGUAGE, payload: lang })
    }

    return (
        <SelectWrapper>
            <Select onChange={(e) => update(e.target.value as Language)} value={language} label={t('chooseLanguage')}>
                <option value={Language.BOKMAAL}>Bokmål</option>
                <option value={Language.NYNORSK}>Nynorsk</option>
                <option value={Language.ENGELSK}>English</option>
            </Select>
        </SelectWrapper>
    )
}
