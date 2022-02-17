import { useUserContext } from '../../../context/user/UserContext'
import LoggedInUserInfo from './LoggedInUserInfo'
import { Radio, RadioGroup } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'

export default function AboutYou() {
    const { state: user } = useUserContext()
    const { t } = useTranslation()

    return (
        <FormGroup>
            <StepHeading>{t('omDeg:tittel')}</StepHeading>

            <FormGroup>
                <LoggedInUserInfo user={user} />
            </FormGroup>

            <FormGroup>
                <RadioGroup legend={'Bor du på denne adressen?'}>
                    <Radio value={'Ja'}>Ja</Radio>
                    <Radio value={'Nei'}>Nei</Radio>
                </RadioGroup>
            </FormGroup>
        </FormGroup>
    )
}
