import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import { BodyLong, Heading, Label } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { RHFInput } from '../../common/rhf/RHFInput'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { FormProvider, useForm } from 'react-hook-form'
import DatePicker from '../../common/DatePicker'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import WhyWeAsk from '../../common/WhyWeAsk'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import useCountries from '../../../hooks/useCountries'
import SelfEmploymentDetails from './SelfEmploymentDetails'
import { ActionTypes, IDeceasedParent } from '../../../context/application/application'
import { StepProps } from '../Dialogue'
import StaysAbroad from './StaysAbroad'
import PersonInfo from '../../common/PersonInfo'
import FormElement from '../../common/FormElement'

export default function AboutTheDeceased({ next, prev, type }: StepProps) {
    const { t } = useTranslation('aboutTheDeceased')
    const { state, dispatch } = useApplicationContext()
    const { countries }: { countries: any } = useCountries()

    const save = (data: IDeceasedParent) => {
        dispatch({ type: type!!, payload: { ...data } })
        next!!()
    }

    const methods = useForm<any>({
        defaultValues:
            (type === ActionTypes.UPDATE_FIRST_PARENT ? { ...state.firstParent } : { ...state.secondParent }) || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    const wasSelfEmployed = watch('selfEmplyment.wasSelfEmployed')
    const completedMilitaryService = watch('militaryService.completed')
    const staysAbroad = watch('abroadStays.hasStaysAbroad')

    return (
        <FormProvider {...methods}>
            <form>
                <StepHeading>{t('title')}</StepHeading>

                <Label>{t('who')}</Label>
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
                            <RHFInput
                                name={'militaryService.period'}
                                label={t('militaryService.period')}
                                valgfri={true}
                            />
                        </FormElement>
                    )}
                </FormGroup>

                <ErrorSummaryWrapper errors={errors} />

                <Navigation next={handleSubmit(save)} prev={prev} />
            </form>
        </FormProvider>
    )
}
