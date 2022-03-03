import { Alert, BodyLong, Link } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { sendApplication } from '../../../api/api'

export default function Summary({ prev }: StepProps) {
    const navigate = useNavigate()

    const { t } = useTranslation('summary')

    const [error, setError] = useState(false)

    const send = () => {
        // TODO: Map to InnsendSoeknad and send to backend
        sendApplication({})
            .then((response) => {
                console.log(response)

                navigate('/skjema/kvittering')
            })
            .catch((e) => {
                console.error(e)
                setError(true)
            })
    }

    return (
        <FormGroup>
            <StepHeading>{t('title')}</StepHeading>
            <FormGroup>
                <BodyLong>{t('description')}</BodyLong>
            </FormGroup>

            {error && (
                <FormGroup>
                    <Alert variant={'error'}>
                        {t('oppsummering.feilVedSending')}
                        <Link href={t('oppsummering.feilVedSending.href')}>
                            {t('oppsummering.feilVedSending.tittel')}
                        </Link>
                    </Alert>
                </FormGroup>
            )}

            <Navigation send={send} prev={prev} />
        </FormGroup>
    )
}
