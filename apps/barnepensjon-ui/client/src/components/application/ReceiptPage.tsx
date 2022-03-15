import { Alert, BodyLong, BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import useTranslation from '../../hooks/useTranslation'

export default function ReceiptPage() {
    const { t } = useTranslation('receipt')

    return (
        <div className={'forside'}>
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

                <BodyLong>{t('childrenOver18MustNotify')}</BodyLong>

                <ul>
                    <li>
                        <BodyShort>{t('changeInEduation')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('changedIncome')}</BodyShort>
                    </li>
                </ul>

                <BodyLong>
                    {t('moreAboutRightsAndDuties')}&nbsp;
                    <Link href={t('moreAboutRightsAndDutiesLinkHref')}>{t('moreAboutRightsAndDutiesLinkText')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('benefitsChangingTitle')}</Heading>

                <BodyLong>
                    {t('benefitsChangingDescription1')}&nbsp;
                    <Link href={t('benefitsChangingDescription1_href')}>{t('benefitsChangingDescription1_link')}</Link>
                    &nbsp;
                    {t('benefitsChangingDescription2')}&nbsp;
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('viewCaseTitle')}</Heading>

                <BodyLong spacing>
                    {t('viewCaseInfoContentPart1')}&nbsp;
                    <Link href={t('viewCaseInfoLinkHref1')}>{t('viewCaseInfoLinkText1')}</Link>&nbsp;
                    {t('viewCaseInfoContentPart2')}&nbsp;
                </BodyLong>

                <BodyLong spacing>
                    {t('viewCaseInfoContent3')}&nbsp;
                    <Link href={t('viewCaseInfoLinkHref3')}>{t('viewCaseInfoLinkText3')}</Link>.
                </BodyLong>

                <BodyLong>
                    {t('processingTimeText_part1')}
                    <Link href={t('processingTimeHref4')}>{t('processingTimeLink4')}</Link>
                    {t('processingTimeText_part2')}
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <section className={'navigasjon-rad'}>
                    <Button
                        variant={'primary'}
                        type={'button'}
                        onClick={() => (window.location.href = 'https://www.nav.no')}
                    >
                        {t('closeApplicationButton')}
                    </Button>
                </section>
            </FormGroup>
        </div>
    )
}
