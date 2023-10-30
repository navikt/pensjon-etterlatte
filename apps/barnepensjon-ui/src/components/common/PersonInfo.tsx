import useTranslation from '../../hooks/useTranslation'
import { HGrid } from '@navikt/ds-react'
import { RHFFoedselsnummerInput, RHFInput } from './rhf/RHFInput'
import { RHFSelect } from './rhf/RHFSelect'
import FormGroup from './FormGroup'
import useCountries from '../../hooks/useCountries'
import FormElement from './FormElement'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { RHFCheckboksGruppe } from './rhf/RHFCheckboksPanelGruppe'
import { useFormContext } from 'react-hook-form'

interface Props {
    duplicateList?: string[]
}

export default function PersonInfo({ duplicateList }: Props) {
    const { t } = useTranslation('common')
    const { countries }: { countries: any } = useCountries()

    const { watch } = useFormContext()

    const missingFNR = watch('missingFNR.answer')

    return (
        <FormGroup>
            <FormElement>
                <HGrid gap="4" columns={{ xs: 1, sm: 2 }}>
                    <RHFInput name={'firstName'} label={t('firstName')} rules={{ pattern: /^\D+$/ }} />
                    <RHFInput name={'lastName'} label={t('lastName')} rules={{ pattern: /^\D+$/ }} />
                </HGrid>
            </FormElement>
            <FormElement>
                <HGrid gap="4" columns={{ xs: 1, sm: 2 }}>
                    <RHFFoedselsnummerInput
                        name={'fnrDnr'}
                        label={t('fnrDnr')}
                        rules={{
                            validate: {
                                validate: (value) => fnrValidator(value).status === 'valid',
                                duplicate: (value) => !duplicateList || !duplicateList.includes(value),
                            },
                        }}
                    />

                    <RHFSelect name={`citizenship`} label={t('citizenship')} children={countries} />
                </HGrid>
            </FormElement>
            <FormElement>
                <HGrid gap="4" columns={{ xs: 1, sm: 2 }}>
                    <RHFCheckboksGruppe
                        name={'missingFNR.answer'}
                        legend={''}
                        required={false}
                        checkboxes={[
                            {
                                children: t('missingFNR'),
                                value: 'true',
                            },
                        ]}
                    />
                    <div />
                </HGrid>
            </FormElement>
            {missingFNR?.includes('true') && (
                <FormElement>
                    <RHFInput
                        name={'missingFNR.address'}
                        label={'Informasjon som trengs for å ikke trenge fødselsnummer'}
                    />
                </FormElement>
            )}
        </FormGroup>
    )
}
