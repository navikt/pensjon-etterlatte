import useTranslation from '../../hooks/useTranslation'
import { RHFFoedselsnummerInput, RHFInput } from './rhf/RHFInput'
import useCountries, { Options } from '../../hooks/useCountries'
import FormElement from './FormElement'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { RHFCheckboks } from '~components/common/rhf/RHFCheckboksPanelGruppe'
import Datepicker from '~components/common/Datepicker'
import { Alert, Box, VStack } from '@navikt/ds-react'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'

interface Props {
    duplicateList?: string[]
    fnrIsUnknown?: boolean
}

export default function PersonInfo({ duplicateList, fnrIsUnknown }: Props) {
    const { t } = useTranslation('common')
    const { countries }: { countries: Options[] } = useCountries()

    return (
        <>
            <Box maxWidth="22rem">
                <FormElement>
                    <RHFInput name={'firstName'} label={t('firstName')} rules={{ pattern: /^\D+$/ }} />
                </FormElement>

                <FormElement>
                    <RHFInput name={'lastName'} label={t('lastName')} rules={{ pattern: /^\D+$/ }} />
                </FormElement>
            </Box>

            <FormElement>
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
                    legend={''}
                />

                {fnrIsUnknown && (
                    <VStack gap="4">
                        <Alert variant={'info'}>{t('fnrIsUnknownHelpText')}</Alert>
                        <Datepicker name={'dateOfBirth'} label={t('dateOfBirth')} maxDate={new Date()} />
                    </VStack>
                )}
            </FormElement>

            <Box maxWidth="14rem">
                <FormElement>
                    <RHFCombobox
                        name={'citizenship'}
                        label={t('citizenship')}
                        options={countries.map((country) => country.label)}
                    />
                </FormElement>
            </Box>
        </>
    )
}
