import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { Alert, BodyLong, Panel } from '@navikt/ds-react'
import { IParent } from '../../../../context/application/application'
import { TFunction } from '../../../../hooks/useTranslation'
import { UseFormWatch } from 'react-hook-form/dist/types/form'
import { useApplicationContext } from '../../../../context/application/ApplicationContext'
import FormGroup from '../../../common/FormGroup'

interface Props {
    isChild: boolean
    isGuardian: boolean
    t: TFunction
    watch: UseFormWatch<any>
}

export const ParentQuestion = ({ isChild, isGuardian, t, watch }: Props) => {
    const { state: application } = useApplicationContext()
    const bothParents = watch('bothParents')

    const bothParentsText = (): String => {
        if (isGuardian || isChild) {
            return t('bothParents.guardianOrChild', {
                forelder1: getParentText(application.firstParent!),
                forelder2: getParentText(application.secondParent!),
            })
        } else return t('bothParents.parent')
    }

    const getParentText = (parent: IParent): string => {
        return `${parent.firstName} ${parent.lastName} (f. ${parent.fnrDnr.substring(0, 6)})`
    }

    return (
        <FormGroup>
            <FormElement>
                <RHFGeneralQuestionRadio name={'bothParents'} legend={bothParentsText()} />
            </FormElement>

            {bothParents === JaNeiVetIkke.NEI && (
                <Panel border>
                    <Alert inline={true} variant={'error'}>
                        <BodyLong>{t('childrensPension.info')}</BodyLong>
                    </Alert>
                </Panel>
            )}
        </FormGroup>
    )
}
