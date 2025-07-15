import { BodyShort, Box, Heading, HGrid, RadioProps } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Arbeidsmengde, StillingType } from '../../../../typer/arbeidsforhold'
import Bredde from '../../../../typer/bredde'
import { IValg } from '../../../../typer/Spoersmaal'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import Datovelger from '../../../felles/Datovelger'
import { RHFInput, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const TilbudOmJobb = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const ansettelsesforhold = watch('tilbudOmJobb.ansettelsesforhold')
    const sluttdato = watch('tilbudOmJobb.midlertidig.svar')

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    return (
        <SkjemaGruppe>
            <Box marginBlock="4">
                <Heading size={'small'}>{t('merOmSituasjonenDin.tilbudOmJobb.tittel')}</Heading>
            </Box>

            <Box marginBlock="4">
                <RHFInput
                    name={'tilbudOmJobb.arbeidssted'}
                    label={t('merOmSituasjonenDin.tilbudOmJobb.arbeidssted')}
                    htmlSize={Bredde.M}
                />
            </Box>

            <SkjemaGruppe>
                <Datovelger
                    name={`tilbudOmJobb.ansettelsesdato`}
                    label={t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesdato')}
                    minDate={new Date()}
                />
            </SkjemaGruppe>

            <Box marginBlock="4">
                <RHFRadio
                    name={`tilbudOmJobb.ansettelsesforhold` as const}
                    legend={t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold')}
                >
                    {Object.values(StillingType).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
            </Box>

            {ansettelsesforhold === StillingType.fast && (
                <Box marginBlock="4">
                    <Box marginBlock="4">
                        <Heading size={'small'}>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.tittel')}
                        </Heading>
                        <BodyShort>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.beskrivelse.fast')}
                        </BodyShort>
                    </Box>
                    <RHFProsentInput
                        name={`tilbudOmJobb.arbeidsmengde.svar` as const}
                        label={t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar.fast')}
                        htmlSize={Bredde.XS}
                    />
                </Box>
            )}

            {(ansettelsesforhold === StillingType.midlertidig ||
                ansettelsesforhold === StillingType.tilkallingsvikar) && (
                <Box marginBlock="4">
                    <Box marginBlock="4">
                        <Heading size={'small'}>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.tittel')}
                        </Heading>
                        <BodyShort>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.beskrivelse.midlertidig')}
                        </BodyShort>
                    </Box>
                    <Box marginBlock="4">
                        <HGrid
                            columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(8rem, 10rem))' }}
                            gap={'4'}
                            align={'start'}
                        >
                            <RHFNumberInput
                                name={`tilbudOmJobb.arbeidsmengde.svar` as const}
                                label={t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar')}
                            />
                            <RHFSelect
                                name={`tilbudOmJobb.arbeidsmengde.type` as const}
                                selectOptions={[
                                    {
                                        label: t('felles.velg'),
                                        value: '',
                                    },
                                ].concat(arbeidsmengdeValg)}
                                label={t('felles.velg.tittel')}
                            />
                        </HGrid>
                    </Box>
                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio
                            name={`tilbudOmJobb.midlertidig.svar` as const}
                            legend={t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.svar')}
                        />
                    </Box>
                    {sluttdato === IValg.JA && (
                        <Datovelger
                            name={`tilbudOmJobb.midlertidig.sluttdatoVelger`}
                            label={t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.sluttdatoVelger')}
                            minDate={new Date()}
                        />
                    )}
                </Box>
            )}

            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={'tilbudOmJobb.aktivitetsplan.svar'}
                    legend={t('merOmSituasjonenDin.tilbudOmJobb.aktivitetsplan.svar')}
                />
            </Box>
        </SkjemaGruppe>
    )
}

export default TilbudOmJobb
