import { ActionTypes } from '../../../context/application/application'
import { ApplicantSituation } from '../../FrontPage'
import StepHeading from '../../common/StepHeading'
import useTranslation from '../../../hooks/useTranslation'

interface Props {
    type: ActionTypes
    situation?: ApplicantSituation
}

export default function DeceasedParentTitle({ type, situation }: Props) {
    const { t } = useTranslation('aboutTheDeceased')

    let title = t('singleParentTitle')

    const bothParentsDeceased = situation === ApplicantSituation.BOTH_PARENTS_DECEASED

    if (bothParentsDeceased && type === ActionTypes.UPDATE_FIRST_PARENT) {
        title = t('firstParentTitle')
    } else if (bothParentsDeceased && type === ActionTypes.UPDATE_SECOND_PARENT) {
        title = t('secondParentTitle')
    }

    return (
        <>
            <StepHeading>{title}</StepHeading>
        </>
    )
}
