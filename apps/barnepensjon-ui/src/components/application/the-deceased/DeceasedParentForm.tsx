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
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { ApplicantRole, ApplicantSituation } from '../scenario/ScenarioSelection'

interface Props {
    fnrRegisteredParent: string[]
}

export default function DeceaseParentForm({ fnrRegisteredParent }: Props) {
    const { t } = useTranslation('aboutTheDeceased')
    const { countries }: { countries: any } = useCountries()
    const { state } = useApplicationContext()

    const { watch } = useFormContext<IDeceasedParent>()
    const bothParentsDecesed = state.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD

    const completedMilitaryService = watch('militaryService.completed')
    const staysAbroad = watch('staysAbroad.hasStaysAbroad')

    return (
        <>
            <FormGroup>
                <PersonInfo duplicateList={fnrRegisteredParent} />
            </FormGroup>
            <FormGroup>
                <DatePicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
            </FormGroup>

            <FormGroup>
                <Heading size="small">{t('abroadStaysTitle')}</Heading>
                <BodyLong>
                    {isChild ? t('workOrLivingAbroadCanAffectPensionOver18') : t('workOrLivingAbroadCanAffectPension')}
                </BodyLong>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'staysAbroad.hasStaysAbroad'}
                        legend={t('didTheDeceasedLiveAbroad')}
                        vetIkke={true}
                    />
                </FormElement>
                {staysAbroad === JaNeiVetIkke.JA && <StaysAbroad countries={countries} />}
            </FormGroup>

            {bothParentsDecesed && !isChild && <SelfEmploymentDetails />}

            <FormGroup>
                {!isChild && <Heading size="small">{t('otherTitle')}</Heading>}

                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'occupationalInjury'}
                        legend={t('occupationalInjury')}
                        vetIkke={true}
                        description={
                            <WhyWeAsk title="occupationalInjury">{t('whyWeAskAboutOccupationalInjury')}</WhyWeAsk>
                        }
                    />
                </FormElement>

                {bothParentsDecesed && !isChild && (
                    <>
                        <FormElement>
                            <RHFGeneralQuestionRadio
                                name={'militaryService.completed'}
                                legend={t('deceasedHasServedInTheMilitary')}
                                vetIkke={true}
                                description={
                                    <WhyWeAsk title="militaryService">{t('whyWeAskAboutMilitaryService')}</WhyWeAsk>
                                }
                            />
                        </FormElement>

                        {completedMilitaryService === JaNeiVetIkke.JA && (
                            <FormElement>
                                <RHFInput
                                    name={'militaryService.period'}
                                    label={t('militaryServiceYears')}
                                    valgfri={true}
                                />
                            </FormElement>
                        )}
                    </>
                )}
            </FormGroup>
        </>
    )
}
