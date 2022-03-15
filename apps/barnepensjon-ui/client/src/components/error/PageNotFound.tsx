import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import { BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const CenterDiv = styled.div`
    text-align: center;
`

export default function PageNotFound() {
    const navigate = useNavigate()
    const { t } = useTranslation('pageNotFound')

    return (
        <CenterDiv>
            <FormGroup>
                <NavGuide>{t('notFoundTitle')}</NavGuide>
            </FormGroup>

            <FormGroup>
                <Heading spacing size={'small'}>
                    {t('pageDoesNotExist')}
                </Heading>
            </FormGroup>

            <FormGroup>
                <BodyShort>{t('pageDoesNotExistInfo')}</BodyShort>
                <Link href={'reportErrorHref'}>{t('reportErrorLink')}</Link>
            </FormGroup>

            <FormGroup>
                <Button onClick={() => navigate(-1)}>{t('backButton')}</Button>
            </FormGroup>
        </CenterDiv>
    )
}
