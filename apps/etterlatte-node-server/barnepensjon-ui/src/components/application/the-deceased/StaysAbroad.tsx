import useTranslation from '../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFNumberInput } from '../../common/rhf/RHFInput'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { IDeceasedParent, IStaysAbroad } from '../../../context/application/application'
import { Button, Detail, HGrid, Label, Panel } from '@navikt/ds-react'
import { RHFSelect, StandardBreddeRHFSelect } from '../../common/rhf/RHFSelect'
import { useEffect } from 'react'
import { RHFCheckboksGruppe } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { OppholdUtlandType } from '../../../api/dto/FellesOpplysninger'
import Datepicker from '../../common/Datepicker'
import { DeleteFilled } from '@navikt/ds-icons'
import FormElement from '../../common/FormElement'
import styled from 'styled-components'
import { GridColumns, GridGap } from '../../../utils/grid'

const StaysAbroadCheckboxDiv = styled.div`
    .skjemagruppe {
        display: flex;
    }

    .skjemaelement {
        padding-right: 1rem;
    }
`

export default function StaysAbroad({ countries, currencies }: { countries: any; currencies: any }) {
    const { t } = useTranslation('aboutTheDeceased')
    const { control, watch } = useFormContext<IDeceasedParent>()

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: 'staysAbroad.abroadStays',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (fields.length === 0) {
            append({})
        }
    })

    const staysAbroad = watch('staysAbroad')

    const amountOrCurrencyHasInput = (staysAbroad: IStaysAbroad, index: number): boolean => {
        const amount = staysAbroad.abroadStays!![index]?.pension?.amount
        const amountHasInput = amount ? amount.length > 0 : false

        const currency = staysAbroad.abroadStays!![index]?.pension?.currency
        const currencyHasInput = currency ? currency.length > 0 : false

        return amountHasInput || currencyHasInput
    }

    return (
        <>
            {fields.map((field: FieldArrayWithId, index: number) => (
                <FormElement key={field.id}>
                    <Panel border>
                        <FormElement>
                            <StandardBreddeRHFSelect
                                name={`staysAbroad.abroadStays[${index}].country`}
                                label={t('abroadInWhichCountry')}
                                children={countries}
                            />
                        </FormElement>
                        <FormElement>
                            <StaysAbroadCheckboxDiv>
                                <RHFCheckboksGruppe
                                    name={`staysAbroad.abroadStays[${index}].type`}
                                    legend={t('livedOrWorkedAbroad')}
                                    required={true}
                                    checkboxes={Object.values(OppholdUtlandType).map((value) => {
                                        return { children: t(value), value }
                                    })}
                                />
                            </StaysAbroadCheckboxDiv>
                        </FormElement>
                        <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
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
                        </HGrid>
                        <FormElement>
                            <RHFGeneralQuestionRadio
                                name={`staysAbroad.abroadStays[${index}].medlemFolketrygd`}
                                legend={t('deceasedWasMemberOfFolketrygdenAbroad')}
                                vetIkke={true}
                                description={t('whyWeAskAboutFolketrygden')}
                            />
                        </FormElement>

                        <FormElement>
                            <Label>{t('pensionReceivedFromAbroadTitle')}</Label>
                            <Detail textColor={'subtle'}>{t('pensionReceivedFromAbroadDescription')}</Detail>
                            <HGrid
                                gap={'2'}
                                columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(10rem, 14rem))' }}
                                align={'start'}
                            >
                                <FormElement>
                                    <RHFNumberInput
                                        name={`staysAbroad.abroadStays[${index}].pension.amount`}
                                        label={t('amountAbroad')}
                                        required={amountOrCurrencyHasInput(staysAbroad, index)}
                                    />
                                </FormElement>

                                <FormElement>
                                    <RHFSelect
                                        name={`staysAbroad.abroadStays[${index}].pension.currency`}
                                        label={t('chooseCurrency', { ns: 'common' })}
                                        children={currencies}
                                        required={amountOrCurrencyHasInput(staysAbroad, index)}
                                    />
                                </FormElement>
                            </HGrid>
                        </FormElement>

                        {fields.length > 1 && (
                            <div style={{ textAlign: 'right' }}>
                                <FormElement>
                                    <Button variant={'secondary'} type={'button'} onClick={() => remove(index)}>
                                        <DeleteFilled /> &nbsp;{t('deleteButton', { ns: 'btn' })}
                                    </Button>
                                </FormElement>
                            </div>
                        )}
                    </Panel>
                </FormElement>
            ))}
            <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                {t('addCountryButton')}
            </Button>
        </>
    )
}
