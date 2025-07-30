import { ReadMore, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { IDeceasedParent } from '../../../context/application/application'
import useCountries, { Options } from '../../../hooks/useCountries'
import { useCurrencies } from '../../../hooks/useCurrencies'
import useTranslation from '../../../hooks/useTranslation'
import { ApplicantRole } from '../../../types/applicant'
import Datepicker from '../../common/Datepicker'
import PersonInfo from '../../common/PersonInfo'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import StaysAbroad from './StaysAbroad'

interface Props {
    fnrRegisteredParent: string[]
}

export default function DeceaseParentForm({ fnrRegisteredParent }: Props) {
    const { t } = useTranslation('aboutTheDeceased')
    const { countries }: { countries: Options[] } = useCountries()
    const { currencies } = useCurrencies()
    const { state } = useApplicationContext()
    const { logEvent } = useAnalytics()

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
        <VStack marginBlock="4" gap="4">
            <PersonInfo duplicateList={fnrRegisteredParent} fnrIsUnknown={watch('fnrIsUnknown')} />
            <Datepicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
            <VStack>
                <RHFGeneralQuestionRadio name={'occupationalInjury'} legend={t('occupationalInjury')} vetIkke={true} />
                <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                    {isChild ? t('whyWeAskAboutOccupationalInjuryOver18') : t('whyWeAskAboutOccupationalInjury')}
                </ReadMore>
            </VStack>
            <VStack>
                <RHFGeneralQuestionRadio
                    name={'staysAbroad.hasStaysAbroad'}
                    legend={t('didTheDeceasedLiveAbroad')}
                    vetIkke={true}
                />
                <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                    {isChild ? t('workOrLivingAbroadCanAffectPensionOver18') : t('workOrLivingAbroadCanAffectPension')}
                </ReadMore>
            </VStack>
            {staysAbroad === JaNeiVetIkke.JA && <StaysAbroad countries={countries} currencies={currencies} />}
        </VStack>
    )
}
