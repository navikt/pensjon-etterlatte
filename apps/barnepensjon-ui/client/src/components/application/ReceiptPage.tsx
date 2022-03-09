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
                <Heading size={'medium'}>{t('lifeChangeTitle')}</Heading>

                <BodyLong>{t('lifeChangeInfo')}</BodyLong>

                <ul>
                    <li>
                        <BodyShort>{t('lifeChangeList.family')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('lifeChangeList.moving')}</BodyShort>
                    </li>
                </ul>

                <BodyLong>{t('lifeChangeInfo2')}</BodyLong>

                <ul>
                    <li>
                        <BodyShort>{t('lifeChangeList2.education')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('lifeChangeList2.income')}</BodyShort>
                    </li>
                </ul>

                <BodyLong>
                    {t('lifeChange.rightsInfo')}&nbsp;
                    <Link href={t('lifeChange.rightsInfoLinkHref')}>{t('lifeChange.rightsInfoLinkText')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('benefitsChangingTitle')}</Heading>

                <BodyLong>
                    {t('benefitsChangingDescription1')}&nbsp;
                    <Link href={t('benefitsChangingDescription1.href')}>{t('benefitsChangingDescription1.link')}</Link>
                    &nbsp;
                    {t('benefitsChangingDescription2')}&nbsp;
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('viewCaseTitle')}</Heading>

                <BodyLong>
                    {t('viewCaseInfoContentPart1')}&nbsp;
                    <Link href={t('viewCaseInfoLinkHref1')}>{t('viewCaseInfoLinkText1')}</Link>&nbsp;
                    {t('viewCaseInfoContentPart2')}&nbsp;
                </BodyLong>
                <br />
                <BodyLong>
                    {t('viewCaseInfoContent3')}&nbsp;
                    <Link href={t('viewCaseInfoLinkHref3')}>{t('viewCaseInfoLinkText3')}</Link>.
                </BodyLong>
                <br />
                <BodyLong>
                    <Link href={t('viewCaseInfoLinkHref4')}>{t('viewCaseInfoLinkText4')}</Link>
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
