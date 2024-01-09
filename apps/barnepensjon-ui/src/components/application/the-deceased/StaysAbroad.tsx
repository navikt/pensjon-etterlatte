import useTranslation from '../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFInput } from '../../common/rhf/RHFInput'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { IParent } from '../../../context/application/application'
import { Button, HGrid, Panel } from '@navikt/ds-react'
import { StandardBreddeRHFSelect } from '../../common/rhf/RHFSelect'
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

export default function StaysAbroad({ countries }: { countries: any }) {
    const { t } = useTranslation('aboutTheDeceased')
    const { control } = useFormContext<IParent>()

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
                            <RHFInput
                                name={`staysAbroad.abroadStays[${index}].pensionAmount`}
                                label={t('pensionReceivedFromAbroad')}
                                valgfri={true}
                            />
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
