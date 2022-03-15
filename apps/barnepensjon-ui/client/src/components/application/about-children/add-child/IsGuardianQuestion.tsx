import { TFunction } from '../../../../hooks/useTranslation'
import { UseFormWatch } from 'react-hook-form/dist/types/form'
import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { Alert, BodyLong, Panel } from '@navikt/ds-react'

interface Props {
    isGuardian: boolean
    t: TFunction
    watch: UseFormWatch<any>
}

export const IsGuardianQuestion = ({ isGuardian, t, watch }: Props) => {
    const loggedInUserIsGuardian = watch('loggedInUserIsGuardian')

    return (
        <>
            {isGuardian && (
                <>
                    <FormElement>
                        <RHFGeneralQuestionRadio name={'loggedInUserIsGuardian'} legend={t('loggedInUserIsGuardian')} />
                    </FormElement>

                    {loggedInUserIsGuardian === JaNeiVetIkke.NEI && (
                        <Panel border>
                            <Alert inline={true} variant={'info'}>
                                <BodyLong>{t('onlyGuardiansCanApply')}</BodyLong>
                            </Alert>
                        </Panel>
                    )}
                </>
            )}
        </>
    )
}
