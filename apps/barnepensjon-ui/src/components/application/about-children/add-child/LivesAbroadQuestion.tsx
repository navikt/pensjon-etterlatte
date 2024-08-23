import FormElement from '../../../common/FormElement'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { RHFInput } from '../../../common/rhf/RHFInput'
import useTranslation from '../../../../hooks/useTranslation'
import { Box } from '@navikt/ds-react'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'

interface Props {
    isChild: boolean
    countries: any
    livesAbroadAnswer?: JaNeiVetIkke
}

export const LivesAbroadQuestion = ({ isChild, countries, livesAbroadAnswer }: Props) => {
    const { t } = useTranslation('aboutChildren')

    return (
        <>
            <FormElement>
                <RHFGeneralQuestionRadio
                    id={'staysAbroadAnswer'}
                    name={'staysAbroad.answer'}
                    legend={!isChild ? t('doesTheChildLiveAbroad') : t('doesTheSiblingLiveAbroad')}
                />
            </FormElement>

            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                <>
                    <Box maxWidth="14rem">
                        <FormElement>
                            <RHFCombobox
                                name={'staysAbroad.country'}
                                label={t('stayAbroadCountry')}
                                options={countries.map((country: any) => country.label)}
                            />
                        </FormElement>
                    </Box>

                    <FormElement>
                        <RHFInput name={'staysAbroad.address'} label={t('addressAbroad')} />
                    </FormElement>
                </>
            )}
        </>
    )
}
