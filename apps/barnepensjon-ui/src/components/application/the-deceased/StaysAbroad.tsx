import { DeleteFilled } from '@navikt/ds-icons'
import { BodyShort, Box, Button, HGrid, Label, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { OppholdUtlandType } from '~api/dto/FellesOpplysninger'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'
import { IDeceasedParent, IStaysAbroad } from '~context/application/application'
import { Options } from '~hooks/useCountries'
import { options } from '~hooks/useCurrencies'
import useTranslation from '../../../hooks/useTranslation'
import Datepicker from '../../common/Datepicker'
import { RHFCheckboksGruppe } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { RHFNumberInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFSelect } from '../../common/rhf/RHFSelect'

export default function StaysAbroad({ countries, currencies }: { countries: Options[]; currencies: options[] }) {
    const { t } = useTranslation('aboutTheDeceased')
    const { control, watch } = useFormContext<IDeceasedParent>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'staysAbroad.abroadStays',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (fields.length === 0) {
            append(Object.create({}))
        }
    })

    const staysAbroad = watch('staysAbroad')

    const amountOrCurrencyHasInput = (staysAbroad: IStaysAbroad, index: number): boolean => {
        if (staysAbroad.abroadStays) {
            const amount = staysAbroad.abroadStays[index]?.pension?.amount
            const amountHasInput = amount ? amount.length > 0 : false

            const currency = staysAbroad.abroadStays[index]?.pension?.currency
            const currencyHasInput = currency ? currency.length > 0 : false

            return amountHasInput || currencyHasInput
        }
        return false
    }

    return (
        <>
            {fields.map((field: FieldArrayWithId, index: number) => (
                <Box
                    key={field.id}
                    borderColor={'border-info'}
                    borderWidth={'0 0 0 4'}
                    background={'surface-selected'}
                    padding="4"
                    marginBlock="4"
                >
                    <VStack gap="4">
                        <Box maxWidth="14rem">
                            <RHFCombobox
                                name={`staysAbroad.abroadStays[${index}].country`}
                                label={t('abroadInWhichCountry')}
                                options={countries.map((country) => country.label)}
                            />
                        </Box>
                        <RHFCheckboksGruppe
                            name={`staysAbroad.abroadStays[${index}].type`}
                            legend={t('livedOrWorkedAbroad')}
                            required={true}
                            checkboxes={Object.values(OppholdUtlandType).map((value) => {
                                return { children: t(value), value }
                            })}
                        />
                        <Datepicker
                            name={`staysAbroad.abroadStays[${index}].fromDate`}
                            label={t('stayedAbroadFromDate')}
                            valgfri={true}
                            maxDate={new Date()}
                        />
                        <Datepicker
                            name={`staysAbroad.abroadStays[${index}].toDate`}
                            label={t('stayedAbroadToDate')}
                            valgfri={true}
                            maxDate={new Date()}
                        />
                        <RHFGeneralQuestionRadio
                            name={`staysAbroad.abroadStays[${index}].medlemFolketrygd`}
                            legend={t('deceasedWasMemberOfFolketrygdenAbroad')}
                            vetIkke={true}
                            description={t('whyWeAskAboutFolketrygden')}
                        />
                        <VStack>
                            <Label>{t('pensionReceivedFromAbroadTitle')}</Label>
                            <BodyShort textColor={'subtle'}>{t('pensionReceivedFromAbroadDescription')}</BodyShort>
                            <HGrid
                                gap={'2'}
                                columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(10rem, 14rem))' }}
                                align={'start'}
                            >
                                <VStack gap="4">
                                    <RHFNumberInput
                                        name={`staysAbroad.abroadStays[${index}].pension.amount`}
                                        label={t('amountAbroad')}
                                        required={amountOrCurrencyHasInput(staysAbroad, index)}
                                    />
                                    <RHFSelect
                                        name={`staysAbroad.abroadStays[${index}].pension.currency`}
                                        label={t('chooseCurrency', { ns: 'common' })}
                                        children={currencies}
                                        required={amountOrCurrencyHasInput(staysAbroad, index)}
                                    />
                                </VStack>
                            </HGrid>
                        </VStack>
                    </VStack>

                    {fields.length > 1 && (
                        <Box marginBlock="4">
                            <Button
                                variant={'secondary'}
                                type={'button'}
                                onClick={() => remove(index)}
                                icon={<DeleteFilled aria-hidden />}
                            >
                                {t('deleteButton', { ns: 'btn' })}
                            </Button>
                        </Box>
                    )}
                </Box>
            ))}
            <div>
                <Button
                    variant={'secondary'}
                    type={'button'}
                    onClick={() => append(Object.create({}), { shouldFocus: true })}
                >
                    {t('addCountryButton')}
                </Button>
            </div>
        </>
    )
}
