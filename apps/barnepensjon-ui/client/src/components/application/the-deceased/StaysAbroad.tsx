import useTranslation from '../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import FormGroup from '../../common/FormGroup'
import { RHFInput } from '../../common/rhf/RHFInput'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { IDeceasedParent } from '../../../context/application/application'
import { Button, Cell, Grid, Panel } from '@navikt/ds-react'
import { RHFSelect } from '../../common/rhf/RHFSelect'
import { useEffect } from 'react'
import { RHFCheckboksGruppe } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { OppholdUtlandType } from '../../../api/dto/FellesOpplysninger'
import DatePicker from '../../common/DatePicker'
import WhyWeAsk from '../../common/WhyWeAsk'
import { DeleteFilled } from '@navikt/ds-icons'

export default function StaysAbroad({ countries }: { countries: any }) {
    const { t } = useTranslation('aboutTheDeceased')
    const { control } = useFormContext<IDeceasedParent>()

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
        <FormGroup>
            <br />
            {fields.map((field: FieldArrayWithId, index: number) => (
                <FormGroup>
                    <Panel border key={field.id}>
                        <Grid>
                            <Cell xs={12} md={6}>
                                <RHFSelect
                                    name={`staysAbroad.abroadStays[${index}].country`}
                                    label={t('staysAbroad.abroadStays.country')}
                                    selectOptions={countries}
                                />
                            </Cell>
                            <Cell xs={12} md={6}>
                                <RHFCheckboksGruppe
                                    name={`staysAbroad.abroadStays[${index}].type`}
                                    legend={t('staysAbroad.abroadStays.type')}
                                    checkboxes={[
                                        {
                                            label: t(`oppholdUtlandType.${OppholdUtlandType.BODD.valueOf()}`),
                                            value: OppholdUtlandType.BODD,
                                            required: true,
                                        },
                                        {
                                            label: t(`oppholdUtlandType.${OppholdUtlandType.ARBEIDET.valueOf()}`),
                                            value: OppholdUtlandType.ARBEIDET,
                                            required: true,
                                        },
                                    ]}
                                />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell xs={12} md={6}>
                                <DatePicker
                                    name={`staysAbroad.abroadStays[${index}].fromDate`}
                                    label={t('staysAbroad.abroadStays.fromDate')}
                                    maxDate={new Date()}
                                />
                            </Cell>
                            <Cell xs={12} md={6}>
                                <DatePicker
                                    name={`staysAbroad.abroadStays[${index}].toDate`}
                                    label={t('staysAbroad.abroadStays.toDate')}
                                    maxDate={new Date()}
                                />
                            </Cell>
                        </Grid>
                        <br />
                        <RHFGeneralQuestionRadio
                            name={`staysAbroad.abroadStays[${index}].medlemFolketrygd`}
                            legend={t('staysAbroad.abroadStays.medlemFolketrygd')}
                            vetIkke={true}
                            description={
                                // Usikker på om denne trengs for BP, eller kun for GP?
                                <WhyWeAsk title="medlemFolketrygd">
                                    {t('staysAbroad.abroadStays.medlemFolketrygd.why')}
                                </WhyWeAsk>
                            }
                        />
                        <br />
                        <RHFInput
                            name={`staysAbroad.abroadStays[${index}].pensionAmount`}
                            label={t('staysAbroad.abroadStays.pensionAmount')}
                        />

                        {fields.length > 1 && (
                            <div style={{ textAlign: 'right' }}>
                                <br />
                                <Button variant={'secondary'} type={'button'} onClick={() => remove(index)}>
                                    <DeleteFilled /> &nbsp;{t('btn.delete')}
                                </Button>
                            </div>
                        )}
                    </Panel>
                </FormGroup>
            ))}
            <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                {t('btn.addCountry')}
            </Button>
        </FormGroup>
    )
}
