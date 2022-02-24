import { Select } from '@navikt/ds-react'
import { Language } from '../../context/language/language'
import { useLanguageContext } from '../../context/language/LanguageContext'
import useTranslation from '../../hooks/useTranslation'
import styled from 'styled-components'

const SelectWrapper = styled.div`
    max-width: 200px;
    text-align: center;
    margin: 0 auto;
`

export default function LanguageSelect() {
    const { language, updateLanguage } = useLanguageContext()

    const { t } = useTranslation('felles')

    return (
        <SelectWrapper>
            <Select
                onChange={(e) => updateLanguage(e.target.value as Language)}
                value={language}
                label={t('velgSpraak')}
            >
                <option value={Language.BOKMAAL}>Bokmål</option>
                <option value={Language.NYNORSK}>Nynorsk</option>
                <option value={Language.ENGELSK}>English</option>
            </Select>
        </SelectWrapper>
    )
}
