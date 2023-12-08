import { Alert, BodyLong, BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import FormGroup from '../common/FormGroup'
import useTranslation from '../../hooks/useTranslation'
import FormElement from '../common/FormElement'
import { useEffect } from 'react'
import styled from 'styled-components'

const FormGroupCenter = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 0 2rem 0;
    padding: 0;
    border: 0;
`

const ReceiptContainer = styled.div`
    margin-top: 2rem;
`

export default function ReceiptPage() {
    const { t } = useTranslation('receipt')

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener('popstate', () => {
            window.history.pushState(null, document.title, window.location.href)
        })
    }, [])

    return (
        <ReceiptContainer>
            <Heading size={'large'} spacing align={'center'}>
                {t('pageTitle')}
            </Heading>

            <FormGroup>
                <Alert variant={'success'}>{t('contact')}</Alert>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('viewCaseTitle')}</Heading>

                <FormElement>
                    <BodyLong>
                        {t('viewCaseInfoContentPart1')}{' '}
                        <Link href={t('processingTimeHref')}>{t('processingTimeLink')}</Link>
                    </BodyLong>
                </FormElement>

                <FormElement>
                    <BodyLong>
                        {t('viewCaseInfoContent2')}&nbsp;
                        <Link href={t('viewCaseInfoLinkHref2')}>{t('viewCaseInfoLinkText2')}</Link>.
                    </BodyLong>
                </FormElement>
            </FormGroup>

            <FormGroup>
                <Alert variant={'info'}>
                    <Heading size={'medium'}>{t('youMustNotifyRegardingChanges')}</Heading>

                    <BodyLong>{t('importantChangesCanAffectYourRights')}</BodyLong>

                    <ul>
                        <li>
                            <BodyShort>{t('changeInLivingSituation')}</BodyShort>
                        </li>
                        <li>
                            <BodyShort>{t('changeAddressOrMoveAbroad')}</BodyShort>
                        </li>
                    </ul>

                    <BodyLong>
                        {t('moreAboutChanges')}&nbsp;
                        <Link href={t('moreAboutChangesLinkHref')}>{t('moreAboutChangesLinkText')}</Link>
                    </BodyLong>
                </Alert>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('submissionOfGuardianshipInfo')}</Heading>

                <BodyLong>
                    {t('guardianshipMustBeConfirmed')}&nbsp;
                    <Link href={t('guardianshipMustBeConfirmedHref')}>{t('guardianshipMustBeConfirmedLink')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroupCenter>
                <Button
                    variant={'secondary'}
                    type={'button'}
                    onClick={() => (window.location.href = t('closeApplicationButtonHref'))}
                >
                    {t('closeApplicationButton')}
                </Button>
            </FormGroupCenter>
        </ReceiptContainer>
    )
}
