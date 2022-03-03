import useTranslation from '../../hooks/useTranslation'
import { Cell, Grid } from '@navikt/ds-react'
import { RHFFoedselsnummerInput, RHFInput } from './rhf/RHFInput'
import { RHFSelect } from './rhf/RHFSelect'
import FormGroup from './FormGroup'
import useCountries from '../../hooks/useCountries'
import FormElement from './FormElement'

export default function PersonInfo() {
    const { t } = useTranslation('common')
    const { countries }: { countries: any } = useCountries()

    return (
        <FormGroup>
            <FormElement>
                <Grid>
                    <Cell xs={12} md={6}>
                        <RHFInput name={'firstName'} label={t('firstName')} rules={{ pattern: /^\D+$/ }} />
                    </Cell>

                    <Cell xs={12} md={6}>
                        <RHFInput name={'lastName'} label={t('lastName')} rules={{ pattern: /^\D+$/ }} />
                    </Cell>
                </Grid>
            </FormElement>
            <FormElement>
                <Grid>
                    <Cell xs={12} md={6}>
                        <RHFFoedselsnummerInput
                            name={'fnrDnr'}
                            label={t('fnrDnr')}
                            placeholder={t('fnrDnr.placeholder')}
                        />
                    </Cell>

                    <Cell xs={12} md={6}>
                        <RHFSelect name={`citizenship`} label={t('citizenship')} selectOptions={countries} />
                    </Cell>
                </Grid>
            </FormElement>
        </FormGroup>
    )
}
