import FormGroup from '../../common/FormGroup'
import StepHeading from '../../common/StepHeading'
import { BodyLong, Cell, Grid, Heading, Label } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { RHFFoedselsnummerInput, RHFInput } from '../../common/rhf/RHFInput'
import { RHFSelect } from '../../common/rhf/RHFSelect'
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
import { ActionTypes, DeceasedParent } from '../../../context/application/application'
import { StepProps } from '../Dialogue'
import StaysAbroad from './StaysAbroad'

export default function AboutTheDeceased({ next, prev, type }: StepProps) {
    const { t } = useTranslation('aboutTheDeceased')
    const { state, dispatch } = useApplicationContext()
    const { countries }: { countries: any } = useCountries()

    const save = (data: DeceasedParent) => {
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
                <FormGroup>
                    <StepHeading>{t('title')}</StepHeading>

                    <FormGroup>
                        <Label>{t('who')}</Label>

                        <Grid>
                            <Cell xs={12} md={6}>
                                <RHFInput name={'firstName'} label={t('firstName')} />
                            </Cell>

                            <Cell xs={12} md={6}>
                                <RHFInput name={'lastName'} label={t('lastName')} />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell xs={12} md={6}>
                                <RHFFoedselsnummerInput
                                    name={'fnrDnr'}
                                    label={t('fnrDnr')}
                                    placeholder={t('fnrDnr.placeholder')}
                                />
                            </Cell>

                            <Cell xs={12} md={6}>
                                <RHFSelect name={`citizenship`} label={t('citizenship')} selectOptions={countries} />
                            </Cell>
                        </Grid>
                    </FormGroup>

                    <FormGroup>
                        <DatePicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
                    </FormGroup>

                    <FormGroup>
                        <Heading size="small">{t('abroadStays.title')}</Heading>
                        <BodyLong>{t('abroadStays.ingress')}</BodyLong>
                        <br />
                        <RHFGeneralQuestionRadio
                            name={'abroadStays.hasStaysAbroad'}
                            legend={t('abroadStays.hasStaysAbroad')}
                            vetIkke={true}
                        />

                        {staysAbroad === JaNeiVetIkke.JA && <StaysAbroad countries={countries} />}
                    </FormGroup>

                    <FormGroup>
                        <Heading size="small">{t('selfEmplyment.title')}</Heading>
                        <BodyLong>{t('selfEmplyment.ingress')}</BodyLong>
                        <br />
                        <RHFGeneralQuestionRadio
                            name={'selfEmplyment.wasSelfEmployed'}
                            legend={t('selfEmplyment.wasSelfEmployed')}
                            vetIkke={true}
                        />

                        {wasSelfEmployed === JaNeiVetIkke.JA && <SelfEmploymentDetails />}
                    </FormGroup>

                    <FormGroup>
                        {/* Næringsinntekt og militærtjeneste er kun relevant dersom begge foreldrene er døde. */}
                        <Heading size="small">{t('other.title')}</Heading>

                        <FormGroup>
                            <RHFGeneralQuestionRadio
                                name={'occupationalInjury'}
                                legend={t('occupationalInjury')}
                                vetIkke={true}
                                description={
                                    <WhyWeAsk title="occupationalInjury">{t('occupationalInjury.why')}</WhyWeAsk>
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <RHFGeneralQuestionRadio
                                name={'militaryService.completed'}
                                legend={t('militaryService.completed')}
                                vetIkke={true}
                                description={<WhyWeAsk title="militaryService">{t('militaryService.why')}</WhyWeAsk>}
                            />
                        </FormGroup>

                        {completedMilitaryService === JaNeiVetIkke.JA && (
                            <FormGroup>
                                <RHFInput
                                    name={'militaryService.period'}
                                    label={t('militaryService.period')}
                                    valgfri={true}
                                />
                            </FormGroup>
                        )}
                    </FormGroup>
                </FormGroup>

                <ErrorSummaryWrapper errors={errors} />

                <Navigation next={handleSubmit(save)} prev={prev} />
            </form>
        </FormProvider>
    )
}
