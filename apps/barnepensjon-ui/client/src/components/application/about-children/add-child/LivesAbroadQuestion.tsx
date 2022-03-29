import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { RHFInput } from '../../../common/rhf/RHFInput'
import useTranslation from '../../../../hooks/useTranslation'
import { RHFSelect } from '../../../common/rhf/RHFSelect'

interface Props {
    isChild: boolean
    countries: any
    livesAbroadAnswer?: JaNeiVetIkke
}

export const LivesAbroadQuestion = ({ isChild, countries, livesAbroadAnswer }: Props) => {
    const { t } = useTranslation('aboutChildren')

    return (
        <>
            <FormElement>
                <RHFGeneralQuestionRadio
                    name={'staysAbroad.answer'}
                    legend={!isChild ? t('doesTheChildLiveAbroad') : t('doesTheSiblingLiveAbroad')}
                />
            </FormElement>

            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                <>
                    <FormElement>
                        <RHFSelect
                            name={'staysAbroad.country'}
                            label={t('stayAbroadCountry')}
                            selectOptions={countries}
                        />
                    </FormElement>

                    <FormElement>
                        <RHFInput name={'staysAbroad.address'} label={t('addressAbroad')} />
                    </FormElement>
                </>
            )}
        </>
    )
}
