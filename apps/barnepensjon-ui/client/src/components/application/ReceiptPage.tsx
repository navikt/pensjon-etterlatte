import { Alert, BodyLong, BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import useTranslation from '../../hooks/useTranslation'

export default function ReceiptPage() {
    const { t } = useTranslation('receipt')

    return (
        <div className={'forside'}>
            <Alert variant={'error'}>TODO: Tekster må tilpasses barnepensjon søknad</Alert>

            <FormGroup>
                <NavGuide />
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'} spacing={true}>
                    {t('pageTitle')}
                </Heading>
            </FormGroup>

            <FormGroup>
                <Alert variant={'info'}>{t('contact')}</Alert>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('lifeChangeTitle')}</Heading>

                <BodyLong>{t('lifeChangeInfo')}</BodyLong>

                <ul>
                    <li>
                        <BodyShort>{t('lifeChangeList.maritialStatus')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('lifeChangeList.income')}</BodyShort>
                    </li>
                    <li>
                        <BodyShort>{t('lifeChangeList.address')}</BodyShort>
                    </li>
                </ul>

                <BodyLong>
                    {t('lifeChange.rightsInfo')}&nbsp;
                    <Link href={t('lifeChange.rightsInfoLinkHref')}>{t('lifeChange.rightsInfoLinkText')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('viewCaseTitle')}</Heading>

                {/* TODO: Sett inn riktig lenke for Dine saker */}
                <BodyLong>
                    {t('viewCaseInfoContent')}&nbsp;
                    <Link href={t('viewCaseInfoLinkHref1')}>{t('viewCaseInfoLinkText1')}</Link>
                    &nbsp;
                    {t('viewCaseInfoContent2')}&nbsp;
                    <Link href={t('viewCaseInfoLinkHref2')}>{t('viewCaseInfoLinkText2')}</Link>
                    &nbsp;
                    {t('viewCaseInfoContent3')}&nbsp;
                </BodyLong>
                <br />
                <BodyLong>
                    <Link href={t('viewCaseInfoLinkHref3')}>{t('viewCaseInfoLinkText3')}</Link>
                </BodyLong>
            </FormGroup>

            <FormGroup>
                <Heading size={'medium'}>{t('otherBenefitsTitle')}</Heading>

                <BodyLong>{t('otherBenefitsInfo')}</BodyLong>

                <ul>
                    <li>
                        <BodyShort>
                            <Link href={t('otherBenefitsList.skolepengerHref')}>
                                {t('otherBenefitsList.skolepengerText')}
                            </Link>
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            <Link href={t('otherBenefitsList.barnetilsynHref')}>
                                {t('otherBenefitsList.barnetilsynText')}
                            </Link>
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            <Link href={t('otherBenefitsList.barnetrygdHref')}>
                                {t('otherBenefitsList.barnetrygdText')}
                            </Link>
                        </BodyShort>
                    </li>
                </ul>

                <br />
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
