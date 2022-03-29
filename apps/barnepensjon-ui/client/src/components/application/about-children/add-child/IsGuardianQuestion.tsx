import useTranslation from '../../../../hooks/useTranslation'
import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { Alert, BodyLong, Panel } from '@navikt/ds-react'

interface Props {
    isGuardian: boolean
    loggedInUserIsGuardian?: JaNeiVetIkke
}

export const IsGuardianQuestion = ({ isGuardian, loggedInUserIsGuardian }: Props) => {
    const { t } = useTranslation('aboutChildren')

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
