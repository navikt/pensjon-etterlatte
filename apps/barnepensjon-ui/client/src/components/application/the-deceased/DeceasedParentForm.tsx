import { BodyLong, Heading } from '@navikt/ds-react'
import PersonInfo from '../../common/PersonInfo'
import FormGroup from '../../common/FormGroup'
import DatePicker from '../../common/DatePicker'
import FormElement from '../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import StaysAbroad from './StaysAbroad'
import SelfEmploymentDetails from './SelfEmploymentDetails'
import WhyWeAsk from '../../common/WhyWeAsk'
import { RHFInput } from '../../common/rhf/RHFInput'
import { useFormContext } from 'react-hook-form'
import useCountries from '../../../hooks/useCountries'
import useTranslation from '../../../hooks/useTranslation'
import { IDeceasedParent } from '../../../context/application/application'

export default function DeceaseParentForm() {
    const { t } = useTranslation('aboutTheDeceased')
    const { countries }: { countries: any } = useCountries()

    const { watch } = useFormContext<IDeceasedParent>()

    const wasSelfEmployed = watch('selfEmplyment.wasSelfEmployed')
    const completedMilitaryService = watch('militaryService.completed')
    const staysAbroad = watch('abroadStays.hasStaysAbroad')

    return (
        <>
            <PersonInfo />

            <FormGroup>
                <DatePicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
            </FormGroup>

            <FormGroup>
                <Heading size="small">{t('abroadStays.title')}</Heading>
                <BodyLong>{t('abroadStays.ingress')}</BodyLong>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'abroadStays.hasStaysAbroad'}
                        legend={t('abroadStays.hasStaysAbroad')}
                        vetIkke={true}
                    />
                </FormElement>
                {staysAbroad === JaNeiVetIkke.JA && <StaysAbroad countries={countries} />}
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
                <Heading size="small">{t('other.title')}</Heading>

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
                        description={<WhyWeAsk title="militaryService">{t('militaryService.why')}</WhyWeAsk>}
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
