import { useUserContext } from '../../../context/user/UserContext'
import LoggedInUserInfo from './LoggedInUserInfo'
import { Heading } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import styled from 'styled-components'

const SchemaGroup = styled.div`
    h1 {
        text-align: center;
    }
`

const OmDeg = () => {
    const { state: user } = useUserContext()
    const { t } = useTranslation()

    return (
        <SchemaGroup>
            <Heading size={'medium'} className={'center'}>
                {t('omDeg:tittel')}
            </Heading>
            <LoggedInUserInfo user={user} />
        </SchemaGroup>
    )
}

export default OmDeg
