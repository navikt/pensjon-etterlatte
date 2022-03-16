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
                <NavGuide>{t('applicationNotWorking')}</NavGuide>
            </FormGroup>

            <FormGroup>
                <Alert variant={'error'}>
                    <BodyLong>{t('somethingIsWrongWithTheApplication')}</BodyLong>
                </Alert>
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('weAreWorkingOnTheError')}</BodyLong>
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('reportError')}</BodyLong>

                <Link href={t('reportErrorLink')}>{t('reportErrorHref')}</Link>
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('moreAboutBenefits')}</BodyLong>

                <Link href={t('moreAboutBenefitsLink')}>{t('moreAboutBenefitsHref')}</Link>
            </FormGroup>

            <FormGroup>
                <section>
                    <Button variant={'primary'} onClick={retry}>
                        {t('retryButton')}
                    </Button>
                </section>
            </FormGroup>
        </>
    )
}
