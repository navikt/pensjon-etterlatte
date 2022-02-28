import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import Navigation from '../../common/Navigation'
import { StepProps } from '../Dialogue'
import { ActionTypes } from '../../../context/application/application'
import AboutTheDeceased from '../the-deceased/AboutTheDeceased'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { ApplicantSituation } from '../scenario/ScenarioSelection'

export default function FirstParent({ next, prev }: StepProps) {
    const { state } = useApplicationContext()

    const isAlive: boolean = state.applicant?.applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED

    return isAlive ? (
        <FormGroup>
            <StepHeading>Om den Gjenlevende forelderen</StepHeading>

            <Navigation next={next} prev={prev} />
        </FormGroup>
    ) : (
        <AboutTheDeceased next={next} prev={prev} type={ActionTypes.UPDATE_FIRST_PARENT} />
    )
}
