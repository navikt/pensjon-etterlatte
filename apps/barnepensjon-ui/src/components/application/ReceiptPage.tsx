import { Alert, BodyLong, BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import useTranslation from '../../hooks/useTranslation'
import FormElement from '../common/FormElement'
import { useEffect } from "react";

export default function ReceiptPage() {
    const { t } = useTranslation('receipt')

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener('popstate', () => {
            window.history.pushState(null, document.title, window.location.href);
        })
    }, [])

    return (
        <>
            <FormGroup>
                <NavGuide>{t('thankYou')}</NavGuide>
            </FormGroup>

            <Heading size={'medium'} spacing={true}>
                {t('pageTitle')}
            </Heading>

            <FormGroup>
                <Alert variant={'info'}>{t('contact')}</Alert>
            </FormGroup>

            <FormGroup>
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

                <FormElement>
                    <BodyLong>{t('childrenOver18MustNotify')}</BodyLong>
                </FormElement>

                <BodyLong>
                    {t('moreAboutRightsAndDuties')}&nbsp;
                    <Link href={t('moreAboutRightsAndDutiesLinkHref')}>{t('moreAboutRightsAndDutiesLinkText')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('submissionOfGuardianshipInfo')}</Heading>

                <BodyLong>
                    {t('guardianshipMustBeConfirmed')}&nbsp;
                    <Link href={t('guardianshipMustBeConfirmedHref')}>{t('guardianshipMustBeConfirmedLink')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('benefitsChangingTitle')}</Heading>

                <BodyLong>
                    {t('benefitsChangingDescription1')}&nbsp;
                    <Link href={t('benefitsChangingDescription1_href')}>{t('benefitsChangingDescription1_link')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('viewCaseTitle')}</Heading>

                <FormElement>
                    <BodyLong>{t('viewCaseInfoContentPart1')}&nbsp;</BodyLong>
                </FormElement>

                <FormElement>
                    <BodyLong>
                        {t('viewCaseInfoContent2')}&nbsp;
                        <Link href={t('viewCaseInfoLinkHref2')}>{t('viewCaseInfoLinkText2')}</Link>.
                    </BodyLong>
                </FormElement>

                <BodyLong>
                    {t('processingTimeText_part1')}
                    <Link href={t('processingTimeHref4')}>{t('processingTimeLink4')}</Link>
                    {t('processingTimeText_part2')}
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <section>
                    <Button
                        variant={'primary'}
                        type={'button'}
                        onClick={() => (window.location.href = 'https://www.nav.no')}
                    >
                        {t('closeApplicationButton')}
                    </Button>
                </section>
            </FormGroup>
        </>
    )
}
