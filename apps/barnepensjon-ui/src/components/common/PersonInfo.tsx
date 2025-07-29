import { Alert, Box, VStack } from '@navikt/ds-react'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import Datepicker from '~components/common/Datepicker'
import { RHFCheckboks } from '~components/common/rhf/RHFCheckboksPanelGruppe'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'
import useCountries, { Options } from '../../hooks/useCountries'
import useTranslation from '../../hooks/useTranslation'
import { RHFFoedselsnummerInput, RHFInput } from './rhf/RHFInput'

interface Props {
    duplicateList?: string[]
    fnrIsUnknown?: boolean
}

export default function PersonInfo({ duplicateList, fnrIsUnknown }: Props) {
    const { t } = useTranslation('common')
    const { countries }: { countries: Options[] } = useCountries()

    return (
        <VStack gap="8">
            <Box maxWidth="22rem">
                <VStack gap="4">
                    <RHFInput name={'firstName'} label={t('firstName')} rules={{ pattern: /^\D+$/ }} />

                    <RHFInput name={'lastName'} label={t('lastName')} rules={{ pattern: /^\D+$/ }} />
                </VStack>
            </Box>

            <Box>
                {!fnrIsUnknown && (
                    <RHFFoedselsnummerInput
                        name={'fnrDnr'}
                        label={t('fnrDnr')}
                        htmlSize={20}
                        readOnly={!!fnrIsUnknown}
                        rules={{
                            validate: {
                                validate: (value) => fnrValidator(value).status === 'valid',
                                duplicate: (value) => !duplicateList || !duplicateList.includes(value),
                            },
                        }}
                    />
                )}

                <RHFCheckboks
                    name={'fnrIsUnknown'}
                    checkbox={{
                        children: t('fnrIsUnknown'),
                        value: false,
                    }}
                    required={false}
                    legend={t('fnrIsUnknown')}
                    hideLegend
                />

                {fnrIsUnknown && (
                    <VStack gap="4">
                        <Alert variant={'info'}>{t('fnrIsUnknownHelpText')}</Alert>
                        <Datepicker name={'dateOfBirth'} label={t('dateOfBirth')} maxDate={new Date()} />
                    </VStack>
                )}
            </Box>

            <Box maxWidth="14rem">
                <RHFCombobox
                    name={'citizenship'}
                    label={t('citizenship')}
                    options={countries.map((country) => country.label)}
                />
            </Box>
        </VStack>
    )
}
