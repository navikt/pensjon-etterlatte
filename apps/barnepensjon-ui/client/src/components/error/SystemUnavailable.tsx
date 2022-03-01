import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import { Alert, BodyLong, Button, Link } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'

export default function SystemUnavailable() {
    const { t } = useTranslation('systemUnavailable')

    const retry = () => {
        window.location.href = process.env.PUBLIC_URL
    }

    return (
        <>
            <FormGroup>
                <NavGuide>{t('guide')}</NavGuide>
            </FormGroup>

            <FormGroup>
                <Alert variant={'error'}>
                    <BodyLong>{t('intro')}</BodyLong>
                </Alert>
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('description')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('feedback')}</BodyLong>

                <Link href={t('feedbackLenke')}>{t('feedbackHref')}</Link>
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('moreAboutBenefits')}</BodyLong>

                <Link href={t('moreAboutBenefitsLenke')}>{t('moreAboutBenefitsHref')}</Link>
            </FormGroup>

            <FormGroup>
                <section className={'navigasjon-rad'}>
                    <Button variant={'primary'} onClick={retry}>
                        {t('retryButton')}
                    </Button>
                </section>
            </FormGroup>
        </>
    )
}
