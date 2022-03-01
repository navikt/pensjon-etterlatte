import { StepProps } from '../Dialogue'
import { ActionTypes } from '../../../context/application/application'
import AboutTheDeceased from '../the-deceased/AboutTheDeceased'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { ApplicantSituation } from '../scenario/ScenarioSelection'
import LivingParent from '../living-parent/LivingParent'

export default function FirstParent({ next, prev }: StepProps) {
    const actionType = ActionTypes.UPDATE_FIRST_PARENT
    const { state } = useApplicationContext()

    const isAlive: boolean = state.applicant?.applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED

    return isAlive ? (
        <LivingParent next={next} prev={prev} type={actionType} />
    ) : (
        <AboutTheDeceased next={next} prev={prev} type={actionType} />
    )
}
