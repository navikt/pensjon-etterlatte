import FormElement from '../../../common/FormElement'
import { RHFRadio } from '../../../common/rhf/RHFRadio'
import { Alert, BodyLong, Panel } from '@navikt/ds-react'
import { IParent } from '../../../../context/application/application'
import { TFunction } from '../../../../hooks/useTranslation'
import { UseFormWatch } from 'react-hook-form/dist/types/form'
import { useApplicationContext } from '../../../../context/application/ApplicationContext'
import FormGroup from '../../../common/FormGroup'
import { ParentRelationType } from '../../../../types/person'

interface Props {
    isParent: boolean
    t: TFunction
    watch: UseFormWatch<any>
}

export const ParentQuestion = ({ isParent, t, watch }: Props) => {
    const { state: application } = useApplicationContext()
    const parents = watch('parents')

    const getParentText = (parent: IParent): string => {
        return `${parent.firstName} ${parent.lastName} (f. ${parent.fnrDnr.substring(0, 6)})`
    }

    return (
        <FormGroup>
            <FormElement>
                <RHFRadio
                    legend={t('whoAreTheParents')}
                    name={'parents'}
                    radios={[
                        {
                            label: isParent ? t('remainingParentsChild') : getParentText(application.firstParent!),
                            value: ParentRelationType.FIRST_PARENT,
                            required: true,
                        },
                        {
                            label: isParent ? t('deceasedParentsChild') : getParentText(application.secondParent!),
                            value: ParentRelationType.SECOND_PARENT,
                            required: true,
                        },
                        {
                            label: isParent ? t('jointChild') : t('bothOfTheAbove'),
                            value: ParentRelationType.BOTH,
                            required: true,
                        },
                    ]}
                />
            </FormElement>

            {isParent && ParentRelationType.FIRST_PARENT === parents && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        <BodyLong>{t('onlyChildrenOfDeceasedHaveRights')}</BodyLong>
                    </Alert>
                </Panel>
            )}

            {isParent && ParentRelationType.SECOND_PARENT === parents && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        <BodyLong>{t('onlyParentOrGuardianCanApply')}</BodyLong>
                    </Alert>
                </Panel>
            )}

            {!isParent && [ParentRelationType.FIRST_PARENT, ParentRelationType.SECOND_PARENT].includes(parents) && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        <BodyLong>{t('onlyJointChildrenNecessary')}</BodyLong>
                    </Alert>
                </Panel>
            )}
        </FormGroup>
    )
}
