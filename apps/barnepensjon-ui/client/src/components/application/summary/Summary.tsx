import { BodyLong } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'

export default function Summary({ send, prev }: StepProps) {
    const { t } = useTranslation('summary')
    return (
        <FormGroup>
            <StepHeading>{t('title')}</StepHeading>
            <FormGroup>
                <BodyLong>{t('description')}</BodyLong>
            </FormGroup>
            <Navigation send={send} prev={prev} />
        </FormGroup>
    )
}
