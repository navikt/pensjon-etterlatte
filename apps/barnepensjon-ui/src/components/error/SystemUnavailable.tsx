import FormGroup from '../common/FormGroup'
import NavGuide from '../common/NavGuide'
import { Alert, BodyLong, Button } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import Trans from '../common/Trans'
import { LogEvents, useAmplitude } from '../../hooks/useAmplitude'
import { useEffect } from 'react'

export default function SystemUnavailable() {
    const { t } = useTranslation('systemUnavailable')
    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.SYSTEM_UNAVAILABLE)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

                <Trans value={t('reportErrorLink')} />
            </FormGroup>

            <FormGroup>
                <BodyLong>{t('moreAboutBenefits')}</BodyLong>

                <Trans value={t('moreAboutBenefitsLink')} />
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
