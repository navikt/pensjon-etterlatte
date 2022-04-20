import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import { BodyShort, Button, Heading } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Trans from '../common/Trans'
import { LogEvents, useAmplitude } from '../../hooks/useAmplitude'
import { useEffect } from 'react'

const CenterDiv = styled.div`
    text-align: center;
`

export default function PageNotFound() {
    const navigate = useNavigate()
    const location = useLocation()

    const { t } = useTranslation('pageNotFound')
    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.PAGE_NOT_FOUND, { side: location.pathname })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
                <Trans value={t('reportErrorLink')} />
            </FormGroup>

            <FormGroup>
                <Button onClick={() => navigate(-1)}>{t('backButton', { ns: 'btn' })}</Button>
            </FormGroup>
        </CenterDiv>
    )
}
