import { StepProps } from '../Dialogue'
import AboutTheDeceased from '../the-deceased/AboutTheDeceased'
import { ActionTypes } from '../../../context/application/application'

export default function SecondParent({ next, prev }: StepProps) {
    return <AboutTheDeceased next={next} prev={prev} type={ActionTypes.UPDATE_SECOND_PARENT} />
}
