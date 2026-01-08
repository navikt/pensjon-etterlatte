import { DeleteFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Box, Button, Heading, HGrid, Label, ReadMore, VStack } from '@navikt/ds-react'
import React, { useEffect } from 'react'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'
import useCountries from '../../../../hooks/useCountries'
import { useValutaer } from '../../../../hooks/useValutaer'
import { IAvdoed, OppholdUtlandType } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import Datovelger from '../../../felles/Datovelger'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'

interface Props {
    datoForDoedsfallet?: Date
}

const BoddEllerArbeidetUtland = ({ datoForDoedsfallet }: Props) => {
    const { t } = useTranslation()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { allCountries }: { allCountries: any } = useCountries()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { valutaer }: { valutaer: any } = useValutaer()

    const { control, getValues, setValue, watch } = useFormContext<IAvdoed>()

    const boddEllerArbeidetUtland = watch('boddEllerJobbetUtland.svar')

    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { fields, append } = useFieldArray<any>({
        control,
        name: 'boddEllerJobbetUtland.oppholdUtland',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (boddEllerArbeidetUtland === IValg.JA && fields.length === 0) {
            append({})
        }
    })

    const fjernOppholdUtland = (index: number) => {
        const fjernFraListeBasertPaaIndex = (getValues('boddEllerJobbetUtland.oppholdUtland') || []).filter(
            // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
            (_: any, i: number) => i !== index
        )
        setValue('boddEllerJobbetUtland.oppholdUtland', fjernFraListeBasertPaaIndex)
    }

    return (
        <Box marginBlock="0 12">
            <Heading size="small">{t('omDenAvdoede.boddEllerJobbetUtland.tittel')}</Heading>

            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={'boddEllerJobbetUtland.svar'}
                    legend={t('omDenAvdoede.boddEllerJobbetUtland.svar')}
                    vetIkke
                />
                <ReadMore header={t('readmore.tittel.hvorfor.spoer.vi')}>
                    {t('omDenAvdoede.boddEllerJobbetUtland.ingress')}
                </ReadMore>
            </Box>

            {boddEllerArbeidetUtland === IValg.JA && (
                <VStack gap="4">
                    {fields.map((field: FieldArrayWithId, index: number) => (
                        <Box
                            borderColor={'border-info'}
                            borderWidth={'0 0 0 4'}
                            key={field.id}
                            background={'surface-selected'}
                            padding="4"
                        >
                            <Box maxWidth="14rem" marginBlock="4">
                                <RHFCombobox
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].land`}
                                    label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land')}
                                    options={allCountries}
                                />
                            </Box>

                            <Box marginBlock="4">
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
                            </Box>

                            <VStack gap="4" marginBlock="4">
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

                            <RHFSpoersmaalRadio
                                name={`boddEllerJobbetUtland.oppholdUtland[${index}].medlemFolketrygd` as const}
                                legend={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd')}
                                description={t(
                                    'omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygdHjelpetekst'
                                )}
                                vetIkke
                            />

                            <Box marginBlock="4">
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
                                    <Box marginBlock="4">
                                        <RHFNumberInput
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].mottokPensjon.beloep`}
                                            label={t('inntektenDin.pensjonEllerUfoere.utland.beloep')}
                                            valgfri
                                        />
                                    </Box>

                                    <Box marginBlock="4">
                                        <RHFSelect
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].mottokPensjon.valuta`}
                                            label={t('felles.velgValuta')}
                                            selectOptions={valutaer}
                                            valgfri
                                        />
                                    </Box>
                                </HGrid>
                            </Box>

                            {fields.length > 1 && (
                                <div>
                                    <Button
                                        variant={'secondary'}
                                        type={'button'}
                                        onClick={() => fjernOppholdUtland(index)}
                                        icon={<DeleteFilled />}
                                    >
                                        {t('knapp.fjern')}
                                    </Button>
                                </div>
                            )}
                        </Box>
                    ))}

                    <div>
                        <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                            + {t('knapp.leggTilLand')}
                        </Button>
                    </div>
                </VStack>
            )}
        </Box>
    )
}

export default BoddEllerArbeidetUtland
