import { Box, ReadMore, VStack } from '@navikt/ds-react'
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
import FormElement from '../../common/FormElement'
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
        <>
            <FormElement>
                <PersonInfo duplicateList={fnrRegisteredParent} fnrIsUnknown={watch('fnrIsUnknown')} />
            </FormElement>
            <VStack gap="8" marginBlock="0 8">
                <FormElement>
                    <Datepicker name={'dateOfDeath'} label={t('dateOfDeath')} maxDate={new Date()} />
                </FormElement>

                <VStack>
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
                </VStack>
                <VStack>
                    <FormElement>
                        <RHFGeneralQuestionRadio
                            name={'staysAbroad.hasStaysAbroad'}
                            legend={t('didTheDeceasedLiveAbroad')}
                            vetIkke={true}
                        />
                    </FormElement>
                    <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                        {isChild
                            ? t('workOrLivingAbroadCanAffectPensionOver18')
                            : t('workOrLivingAbroadCanAffectPension')}
                    </ReadMore>
                    <Box marginBlock="4 0">
                        {staysAbroad === JaNeiVetIkke.JA && (
                            <StaysAbroad countries={countries} currencies={currencies} />
                        )}
                    </Box>
                </VStack>
            </VStack>
        </>
    )
}
