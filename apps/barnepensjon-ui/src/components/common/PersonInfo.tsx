import useTranslation from '../../hooks/useTranslation'
import { HGrid } from '@navikt/ds-react'
import { RHFFoedselsnummerInput, RHFInput } from './rhf/RHFInput'
import { RHFSelect } from './rhf/RHFSelect'
import useCountries from '../../hooks/useCountries'
import FormElement from './FormElement'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { GridColumns, GridGap } from '../../utils/grid'

interface Props {
    duplicateList?: string[]
}

export default function PersonInfo({ duplicateList }: Props) {
    const { t } = useTranslation('common')
    const { countries }: { countries: any } = useCountries()

    return (
        <>
            <FormElement>
                <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
                    <RHFInput name={'firstName'} label={t('firstName')} rules={{ pattern: /^\D+$/ }} />
                    <RHFInput name={'lastName'} label={t('lastName')} rules={{ pattern: /^\D+$/ }} />
                </HGrid>
            </FormElement>
            <FormElement>
                <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
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
        </>
    )
}
