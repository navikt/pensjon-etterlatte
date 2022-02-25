import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import Navigation from '../../common/Navigation'

export default function SecondParent({ next, prev }: StepProps) {
    return (
        <FormGroup>
            <StepHeading>Om den andre forelderen</StepHeading>

            <Navigation next={next} prev={prev} />
        </FormGroup>
    )
}
