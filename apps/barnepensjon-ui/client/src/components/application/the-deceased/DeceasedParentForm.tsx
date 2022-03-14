import { BodyLong, Heading } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { IDeceasedParent } from '../../../context/application/application'
import useCountries from '../../../hooks/useCountries'
import useTranslation from '../../../hooks/useTranslation'
import DatePicker from '../../common/DatePicker'
import FormElement from '../../common/FormElement'
import FormGroup from '../../common/FormGroup'
import PersonInfo from '../../common/PersonInfo'
import { RHFInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import WhyWeAsk from '../../common/WhyWeAsk'
import SelfEmploymentDetails from './SelfEmploymentDetails'
import StaysAbroad from './StaysAbroad'

export default function DeceaseParentForm() {
    const { t } = useTranslation('aboutTheDeceased')
    const { countries }: { countries: any } = useCountries()

    const { watch } = useFormContext<IDeceasedParent>()

    const wasSelfEmployed = watch('selfEmplyment.wasSelfEmployed')
    const completedMilitaryService = watch('militaryService.completed')
    const abroadStays = watch('abroadStays.hasStaysAbroad')

    return (
        <>
            <FormGroup>
                <PersonInfo />
            </FormGroup>
            <FormGroup>
                <DatePicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
            </FormGroup>

            <FormGroup>
                <Heading size="small">{t('abroadStaysTitle')}</Heading>
                <BodyLong>{t('workOrLivingAbroadCanAffectPension')}</BodyLong>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'abroadStays.hasStaysAbroad'}
                        legend={t('abroadStays.hasStaysAbroad')}
                        vetIkke={true}
                    />
                </FormElement>
                {abroadStays === JaNeiVetIkke.JA && <StaysAbroad countries={countries} />}
            </FormGroup>

            <FormGroup>
                <Heading size="small">{t('selfEmplyment.title')}</Heading>
                <BodyLong>{t('selfEmplyment.ingress')}</BodyLong>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'selfEmplyment.wasSelfEmployed'}
                        legend={t('selfEmplyment.wasSelfEmployed')}
                        vetIkke={true}
                    />
                </FormElement>
                {wasSelfEmployed === JaNeiVetIkke.JA && <SelfEmploymentDetails />}
            </FormGroup>

            <FormGroup>
                {/* Næringsinntekt og militærtjeneste er kun relevant dersom begge foreldrene er døde. */}
                <Heading size="small">{t('otherTitle')}</Heading>

                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'occupationalInjury'}
                        legend={t('occupationalInjury')}
                        vetIkke={true}
                        description={<WhyWeAsk title="occupationalInjury">{t('occupationalInjury.why')}</WhyWeAsk>}
                    />
                </FormElement>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'militaryService.completed'}
                        legend={t('militaryService.completed')}
                        vetIkke={true}
                        description={<WhyWeAsk title="militaryService">{t('militaryService_why')}</WhyWeAsk>}
                    />
                </FormElement>

                {completedMilitaryService === JaNeiVetIkke.JA && (
                    <FormElement>
                        <RHFInput name={'militaryService.period'} label={t('militaryService.period')} valgfri={true} />
                    </FormElement>
                )}
            </FormGroup>
        </>
    )
}
