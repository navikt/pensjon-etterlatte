import { BodyLong, Heading } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { IDeceasedParent } from '../../../context/application/application'
import useCountries, { Options } from '../../../hooks/useCountries'
import useTranslation from '../../../hooks/useTranslation'
import Datepicker from '../../common/Datepicker'
import FormElement from '../../common/FormElement'
import FormGroup from '../../common/FormGroup'
import PersonInfo from '../../common/PersonInfo'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import StaysAbroad from './StaysAbroad'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useCurrencies } from '../../../hooks/useCurrencies'
import { ApplicantRole } from '../../../types/applicant'

interface Props {
    fnrRegisteredParent: string[]
}

export default function DeceaseParentForm({ fnrRegisteredParent }: Props) {
    const { t } = useTranslation('aboutTheDeceased')
    const { countries }: { countries: Options[] } = useCountries()
    const { currencies }: { currencies: any } = useCurrencies()
    const { state } = useApplicationContext()

    const { watch } = useFormContext<IDeceasedParent>()
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD

    const staysAbroad = watch('staysAbroad.hasStaysAbroad')

    return (
        <>
            <FormElement>
                <PersonInfo duplicateList={fnrRegisteredParent} fnrIsUnknown={watch('fnrIsUnknown')} />
            </FormElement>
            <FormGroup>
                <FormElement>
                    <Datepicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
                </FormElement>
            </FormGroup>

            <FormGroup>
                <Heading size="small">{t('occupationalInjuryTitle')}</Heading>
                <BodyLong>
                    {isChild ? t('whyWeAskAboutOccupationalInjuryOver18') : t('whyWeAskAboutOccupationalInjury')}
                </BodyLong>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'occupationalInjury'}
                        legend={t('occupationalInjury')}
                        vetIkke={true}
                    />
                </FormElement>
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
                {staysAbroad === JaNeiVetIkke.JA && <StaysAbroad countries={countries} currencies={currencies} />}
            </FormGroup>
        </>
    )
}
