import { ReadMore } from '@navikt/ds-react'
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
import { useEffect } from 'react'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'

interface Props {
    fnrRegisteredParent: string[]
}

export default function DeceaseParentForm({ fnrRegisteredParent }: Props) {
    const { t } = useTranslation('aboutTheDeceased')
    const { countries }: { countries: Options[] } = useCountries()
    const { currencies } = useCurrencies()
    const { state } = useApplicationContext()
    const { logEvent } = useAmplitude()

    const { watch } = useFormContext<IDeceasedParent>()
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD

    const staysAbroad = watch('staysAbroad.hasStaysAbroad')

    useEffect(() => {
        if (staysAbroad) {
            logEvent(LogEvents.CLICK, {
                skjemanavn: 'DeceaseParentForm',
                spørsmål: 'didTheDeceasedLiveAbroad',
                svar: staysAbroad,
            })
        }
    }, [staysAbroad])

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
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'occupationalInjury'}
                        legend={t('occupationalInjury')}
                        vetIkke={true}
                    />
                </FormElement>
                <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                    {isChild ? t('whyWeAskAboutOccupationalInjuryOver18') : t('whyWeAskAboutOccupationalInjury')}
                </ReadMore>
            </FormGroup>

            <FormGroup>
                <FormElement>
                    <RHFGeneralQuestionRadio
                        name={'staysAbroad.hasStaysAbroad'}
                        legend={t('didTheDeceasedLiveAbroad')}
                        vetIkke={true}
                    />
                </FormElement>
                <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                    {isChild ? t('workOrLivingAbroadCanAffectPensionOver18') : t('workOrLivingAbroadCanAffectPension')}
                </ReadMore>
                {staysAbroad === JaNeiVetIkke.JA && <StaysAbroad countries={countries} currencies={currencies} />}
            </FormGroup>
        </>
    )
}
