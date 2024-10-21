import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { IAvdoed, OppholdUtlandType } from '../../../../typer/person'
import { RHFNumberInput } from '../../../felles/rhf/RHFInput'
import Datovelger from '../../../felles/Datovelger'
import React, { useEffect } from 'react'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { useTranslation } from 'react-i18next'
import { DeleteFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Box, Button, Heading, HGrid, Label, VStack } from '@navikt/ds-react'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import useCountries from '../../../../hooks/useCountries'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { Panel } from '../../../felles/Panel'
import { useValutaer } from '../../../../hooks/useValutaer'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'

interface Props {
    datoForDoedsfallet?: Date
}

const BoddEllerArbeidetUtland = ({ datoForDoedsfallet }: Props) => {
    const { t } = useTranslation()
    const { allCountries }: { allCountries: any } = useCountries()
    const { valutaer }: { valutaer: any } = useValutaer()

    const { control, watch } = useFormContext<IAvdoed>()

    const boddEllerArbeidetUtland = watch('boddEllerJobbetUtland.svar')

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: 'boddEllerJobbetUtland.oppholdUtland',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (boddEllerArbeidetUtland === IValg.JA && fields.length === 0) {
            append({})
        }
    })

    return (
        <SkjemaGruppe>
            <Heading size="small">{t('omDenAvdoede.boddEllerJobbetUtland.tittel')}</Heading>
            <BodyLong>{t('omDenAvdoede.boddEllerJobbetUtland.ingress')}</BodyLong>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'boddEllerJobbetUtland.svar'}
                    legend={t('omDenAvdoede.boddEllerJobbetUtland.svar')}
                    vetIkke
                />
            </SkjemaElement>

            {boddEllerArbeidetUtland === IValg.JA && (
                <VStack gap="4">
                    {fields.map((field: FieldArrayWithId, index: number) => (
                        <Panel
                            borderColor={'border-info'}
                            borderWidth={'0 0 0 4'}
                            key={field.id}
                            background={'surface-selected'}
                        >
                            <Box maxWidth="14rem">
                                <SkjemaElement>
                                    <RHFCombobox
                                        name={`boddEllerJobbetUtland.oppholdUtland[${index}].land`}
                                        label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land')}
                                        options={allCountries}
                                    />
                                </SkjemaElement>
                            </Box>

                            <SkjemaElement>
                                <RHFCheckboksGruppe
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].beskrivelse` as const}
                                    legend={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse')}
                                    checkboxes={[
                                        {
                                            children: t(OppholdUtlandType.bodd.valueOf()),
                                            value: OppholdUtlandType.bodd,
                                            required: true,
                                        },
                                        {
                                            children: t(OppholdUtlandType.arbeidet.valueOf()),
                                            value: OppholdUtlandType.arbeidet,
                                            required: true,
                                        },
                                    ]}
                                />
                            </SkjemaElement>

                            <SkjemaElement>
                                <VStack gap="4">
                                    <Datovelger
                                        name={`boddEllerJobbetUtland.oppholdUtland[${index}].fraDato` as const}
                                        label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato')}
                                        maxDate={datoForDoedsfallet || new Date()}
                                        valgfri
                                    />
                                    <Datovelger
                                        name={`boddEllerJobbetUtland.oppholdUtland[${index}].tilDato` as const}
                                        label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato')}
                                        maxDate={datoForDoedsfallet || new Date()}
                                        valgfri
                                    />
                                </VStack>
                            </SkjemaElement>

                            <RHFSpoersmaalRadio
                                name={`boddEllerJobbetUtland.oppholdUtland[${index}].medlemFolketrygd` as const}
                                legend={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd')}
                                description={t(
                                    'omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygdHjelpetekst'
                                )}
                                vetIkke
                            />

                            <SkjemaElement>
                                <Label>
                                    {t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.label')}
                                </Label>
                                <BodyShort textColor={'subtle'}>
                                    {t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse')}
                                </BodyShort>

                                <HGrid
                                    gap={'2'}
                                    columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(10rem, 14rem))' }}
                                    align={'start'}
                                >
                                    <SkjemaElement>
                                        <RHFNumberInput
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].mottokPensjon.beloep`}
                                            label={t('inntektenDin.pensjonEllerUfoere.utland.beloep')}
                                            valgfri
                                        />
                                    </SkjemaElement>

                                    <SkjemaElement>
                                        <RHFSelect
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].mottokPensjon.valuta`}
                                            label={t('felles.velgValuta')}
                                            selectOptions={valutaer}
                                            valgfri
                                        />
                                    </SkjemaElement>
                                </HGrid>
                            </SkjemaElement>

                            {fields.length > 1 && (
                                <div>
                                    <Button
                                        variant={'secondary'}
                                        type={'button'}
                                        onClick={() => remove(index)}
                                        icon={<DeleteFilled />}
                                    >
                                        {t('knapp.fjern')}
                                    </Button>
                                </div>
                            )}
                        </Panel>
                    ))}

                    <div>
                        <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                            + {t('knapp.leggTilLand')}
                        </Button>
                    </div>
                </VStack>
            )}
        </SkjemaGruppe>
    )
}

export default BoddEllerArbeidetUtland
