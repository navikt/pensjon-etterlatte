import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { RHFInput } from '../../../common/rhf/RHFInput'
import FormGroup from '../../../common/FormGroup'
import { TFunction } from '../../../../hooks/useTranslation'
import { UseFormWatch } from 'react-hook-form/dist/types/form'
import { RHFSelect } from '../../../common/rhf/RHFSelect'

interface Props {
    isChild: boolean
    countries: any
    t: TFunction
    watch: UseFormWatch<any>
}

export const LivesAbroad = ({ isChild, countries, t, watch }: Props) => {
    const livesAbroadAnswer = watch('staysAbroad.answer')

    return (
        <FormGroup>
            <FormElement>
                <RHFGeneralQuestionRadio
                    name={'staysAbroad.answer'}
                    legend={!isChild ? t('staysAbroad.answer') : t('staysAbroad.sibling.answer')}
                />
            </FormElement>

            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                <>
                    <FormElement>
                        <RHFSelect
                            name={'staysAbroad.country'}
                            label={t('staysAbroad.country')}
                            selectOptions={countries}
                        />
                    </FormElement>

                    <FormElement>
                        <RHFInput name={'staysAbroad.address'} label={t('staysAbroad.address')} />
                    </FormElement>
                </>
            )}
        </FormGroup>
    )
}
