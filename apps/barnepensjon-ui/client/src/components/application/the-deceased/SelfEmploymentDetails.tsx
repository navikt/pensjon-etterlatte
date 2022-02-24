import useTranslation from '../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import FormGroup from '../../common/FormGroup'
import { RHFValutaInput } from '../../common/rhf/RHFInput'

export default function SelfEmploymentDetails() {
    const { t } = useTranslation('aboutTheDeceased')

    return (
        <FormGroup>
            <br />
            <RHFValutaInput
                name={'selfEmplyment.selfEmplymentDetails.income'}
                bredde={'L'}
                valgfri
                type="tel"
                placeholder={t('selfEmplyment.selfEmplymentDetails.income.placeholder')}
                label={t('selfEmplyment.selfEmplymentDetails.income')}
            />
            <br />
            <RHFGeneralQuestionRadio
                name={'selfEmplyment.selfEmplymentDetails.incomeAtDeath'}
                legend={t('selfEmplyment.selfEmplymentDetails.incomeAtDeath')}
                vetIkke
            />
        </FormGroup>
    )
}
