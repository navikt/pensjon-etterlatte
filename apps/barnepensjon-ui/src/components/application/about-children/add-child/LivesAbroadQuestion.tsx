import { Box, VStack } from '@navikt/ds-react'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'
import { Options } from '~hooks/useCountries'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import { RHFInput } from '../../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../../common/rhf/RHFRadio'

interface Props {
    isChild: boolean
    countries: Options[]
    livesAbroadAnswer?: JaNeiVetIkke
}

export const LivesAbroadQuestion = ({ isChild, countries, livesAbroadAnswer }: Props) => {
    const { t } = useTranslation('aboutChildren')

    return (
        <VStack marginBlock="4" gap="4">
            <RHFGeneralQuestionRadio
                id={'staysAbroadAnswer'}
                name={'staysAbroad.answer'}
                legend={!isChild ? t('doesTheChildLiveAbroad') : t('doesTheSiblingLiveAbroad')}
            />

            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                <>
                    <Box maxWidth="14rem">
                        <RHFCombobox
                            name={'staysAbroad.country'}
                            label={t('stayAbroadCountry')}
                            options={countries.map((country) => country.label)}
                        />
                    </Box>

                    <RHFInput name={'staysAbroad.address'} label={t('addressAbroad')} />
                </>
            )}
        </VStack>
    )
}
