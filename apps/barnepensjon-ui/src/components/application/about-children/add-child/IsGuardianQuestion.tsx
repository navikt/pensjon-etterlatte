import useTranslation from '../../../../hooks/useTranslation'
import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { BodyShort } from '@navikt/ds-react'

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
                        <RHFGeneralQuestionRadio
                            id={'isGuardianQuestion'}
                            name={'loggedInUserIsGuardian'}
                            legend={t('loggedInUserIsGuardian')}
                        />
                    </FormElement>

                    {loggedInUserIsGuardian === JaNeiVetIkke.JA && (
                        <BodyShort>{t('needToSendInDocumentation')}</BodyShort>
                    )}
                </>
            )}
        </>
    )
}
