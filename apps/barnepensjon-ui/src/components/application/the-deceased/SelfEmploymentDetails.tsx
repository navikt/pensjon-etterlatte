import useTranslation from '../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFValutaInput } from '../../common/rhf/RHFInput'
import FormElement from '../../common/FormElement'
import { BodyLong, Heading } from '@navikt/ds-react'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import FormGroup from '../../common/FormGroup'
import { useFormContext } from 'react-hook-form'
import { IDeceasedParent } from '../../../context/application/application'

export default function SelfEmploymentDetails() {
    const { t } = useTranslation('aboutTheDeceased')

    const { watch } = useFormContext<IDeceasedParent>()

    const wasSelfEmployed = watch('selfEmplyment.wasSelfEmployed')

    return (
        <FormGroup>
            <Heading size="small">{t('selfEmploymentTitle')}</Heading>
            <BodyLong>{t('weNeedToKnowIfDeceasedWasSelfEmployed')}</BodyLong>
            <FormElement>
                <RHFGeneralQuestionRadio
                    name={'selfEmplyment.wasSelfEmployed'}
                    legend={t('wasTheDeceasedSelfEmployed')}
                    vetIkke={true}
                />
            </FormElement>

            {wasSelfEmployed === JaNeiVetIkke.JA && (
                <>
                    <FormElement>
                        <RHFValutaInput
                            name={'selfEmplyment.selfEmplymentDetails.income'}
                            valgfri
                            type="tel"
                            placeholder={t('incomeFromSelfEmploymentBeforeTaxes')}
                            label={t('incomeFromSelfEmployymentYearBeforeDeath')}
                        />
                    </FormElement>
                    <FormElement>
                        <RHFGeneralQuestionRadio
                            name={'selfEmplyment.selfEmplymentDetails.incomeAtDeath'}
                            legend={t('hadIncomeFromSelfEmployment')}
                            vetIkke
                        />
                    </FormElement>
                </>
            )}
        </FormGroup>
    )
}
