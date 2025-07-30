import { Alert, BodyLong, BodyShort, Box, Button, Heading, Link, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import useTranslation from '../../hooks/useTranslation'

export default function ReceiptPage() {
    const { t } = useTranslation('receipt')

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener('popstate', () => {
            window.history.pushState(null, document.title, window.location.href)
        })
    }, [])

    return (
        <VStack gap="8" marginBlock="8 0">
            <Heading size={'large'} spacing align={'center'}>
                {t('pageTitle')}
            </Heading>

            <Alert variant={'success'}>{t('contact')}</Alert>

            <Box>
                <Heading size={'medium'}>{t('viewCaseTitle')}</Heading>
                <BodyLong>
                    {t('viewCaseInfoContentPart1')}{' '}
                    <Link href={t('processingTimeHref')}>{t('processingTimeLink')}</Link>
                </BodyLong>

                <BodyLong>
                    {t('viewCaseInfoContent2')}
                    <Link href={t('viewCaseInfoLinkHref2')}>{t('viewCaseInfoLinkText2')}</Link>.
                </BodyLong>
            </Box>

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

            <Box>
                <Heading size={'medium'}>{t('submissionOfGuardianshipInfo')}</Heading>

                <BodyLong>
                    {t('guardianshipMustBeConfirmed')}
                    <Link href={t('guardianshipMustBeConfirmedHref')}>{t('guardianshipMustBeConfirmedLink')}</Link>
                </BodyLong>
            </Box>

            <Box>
                <Heading size={'medium'}>{t('taxDeductionTitle')}</Heading>
                <BodyLong spacing>{t('taxDeductionDescription1')}</BodyLong>

                <BodyLong spacing>
                    {t('taxDeductionDescription2')} <br />
                    <Link href={t('taxDeductionLinkHref')}>{t('taxDeductionLinkText')}</Link>
                </BodyLong>
                <BodyLong>{t('taxDeductionDescription3')}</BodyLong>
            </Box>
            <VStack align="center">
                <div>
                    <Button
                        variant={'secondary'}
                        type={'button'}
                        onClick={() => (window.location.href = t('closeApplicationButtonHref'))}
                    >
                        {t('closeApplicationButton')}
                    </Button>
                </div>
            </VStack>
        </VStack>
    )
}
