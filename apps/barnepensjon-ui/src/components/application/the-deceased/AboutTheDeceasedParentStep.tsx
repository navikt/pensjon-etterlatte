import { ActionTypes } from '../../../context/application/application'
import { StepProps } from '../Dialogue'
import DeceasedParent from '../about-parents/DeceasedParent'

export default function AboutTheDeceasedParentStep({ next, prev }: StepProps) {
    return <DeceasedParent next={next} prev={prev} type={ActionTypes.UPDATE_SECOND_PARENT} />
}
