import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import Navigation from '../../common/Navigation'
import { StepProps } from '../Dialogue'

export default function FirstParent({ next, prev }: StepProps) {
    return (
        <FormGroup>
            <StepHeading>Om den ene forelderen</StepHeading>

            <Navigation next={next} prev={prev} />
        </FormGroup>
    )
}
