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
import { BodyLong, Button, Detail, Heading, HGrid, Label } from '@navikt/ds-react'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { useLand } from '../../../../hooks/useLand'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import styled from 'styled-components'
import { Panel } from '../../../felles/Panel'
import { useValutaer } from '../../../../hooks/useValutaer'

const Rad = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    column-gap: 1rem;
`
const ArbeidIUtlandPanel = styled(Panel)`
    @media screen and (max-width: 450px) {
        padding-left: 0;
        padding-right: 0;
        border-left: none;
        border-right: none;
    }
`

interface Props {
    datoForDoedsfallet?: Date
}

const BoddEllerArbeidetUtland = ({ datoForDoedsfallet }: Props) => {
    const { t } = useTranslation()
    const { alleLand }: { land: any; alleLand: any } = useLand()
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
                <>
                    {fields.map((field: FieldArrayWithId, index: number) => (
                        <ArbeidIUtlandPanel border key={field.id} className={'luft-under'}>
                            <SkjemaElement>
                                <RHFSelect
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].land` as const}
                                    label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land')}
                                    selectOptions={alleLand}
                                />
                            </SkjemaElement>
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
                                <Rad>
                                    <div className={'kol'}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].fraDato` as const}
                                            label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato')}
                                            maxDate={datoForDoedsfallet || new Date()}
                                            valgfri
                                        />
                                    </div>
                                    <div className={'kol'}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].tilDato` as const}
                                            label={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato')}
                                            maxDate={datoForDoedsfallet || new Date()}
                                            valgfri
                                        />
                                    </div>
                                </Rad>
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
                                <Detail textColor={'subtle'}>
                                    {t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse')}
                                </Detail>

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
                                <div style={{ textAlign: 'right' }}>
                                    <Button variant={'secondary'} type={'button'} onClick={() => remove(index)}>
                                        <DeleteFilled /> &nbsp;{t('knapp.fjern')}
                                    </Button>
                                </div>
                            )}
                        </ArbeidIUtlandPanel>
                    ))}

                    <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                        + {t('knapp.leggTilLand')}
                    </Button>
                </>
            )}
        </SkjemaGruppe>
    )
}

export default BoddEllerArbeidetUtland
