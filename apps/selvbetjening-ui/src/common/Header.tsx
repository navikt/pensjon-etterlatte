import { Heading, HStack } from '@navikt/ds-react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

export const Header = () => {
    const { t } = useTranslation()

    return (
        <HeaderHStack justify="center" paddingBlock="4">
            <Heading size="large">{t('applicationTitle')}</Heading>
        </HeaderHStack>
    )
}

const HeaderHStack = styled(HStack)`
    border-bottom: var(--a-spacing-1) solid #826ba1;
    background-color: #c1b5d0;
`
