import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import Navigation from '../../common/Navigation'
import { StepProps } from '../Dialogue'

export default function Summary({ send, prev }: StepProps) {
    return (
        <FormGroup>
            <StepHeading>Oppsummering</StepHeading>

            <Navigation send={send} prev={prev} />
        </FormGroup>
    )
}
