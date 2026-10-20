import { BodyShort, Box, Heading, RadioProps, VStack } from '@navikt/ds-react'
import { addYears, isBefore } from 'date-fns'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import Bredde from '../../../../typer/bredde'
import { IValg } from '../../../../typer/Spoersmaal'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { Studieform } from '../../../../typer/utdanning'
import Datovelger from '../../../felles/Datovelger'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const UnderUtdanning = () => {
    const { t } = useTranslation()
    const { state } = useBrukerContext()
    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const studieform = watch('utdanning.naavaerendeUtdanning.studieform')
    const startDatoUtdanning = watch('utdanning.naavaerendeUtdanning.startDato')

    const minSluttDato = (startDato: Date | undefined): Date => {
        if (startDato && isBefore(new Date(), startDato)) return startDato
        return new Date()
    }

    return (
        <Box marginBlock="space-0 space-48">
            <Box marginBlock="space-16">
                <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.tittel')}</Heading>
            </Box>
            <Box marginBlock="space-16">
                <RHFInput
                    name={'utdanning.naavaerendeUtdanning.studiested'}
                    label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studiested')}
                    htmlSize={Bredde.M}
                />
            </Box>
            <Box marginBlock="space-16">
                <RHFInput
                    name={'utdanning.naavaerendeUtdanning.studie'}
                    label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studie')}
                    htmlSize={Bredde.M}
                />
            </Box>
            <RHFRadio
                name={`utdanning.naavaerendeUtdanning.studieform` as const}
                legend={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieform')}
            >
                {Object.values(Studieform).map((value) => {
                    return { children: t(value), value } as RadioProps
                })}
            </RHFRadio>
            {studieform === Studieform.deltid && (
                <Box marginBlock="space-16">
                    <RHFProsentInput
                        name={'utdanning.naavaerendeUtdanning.studieprosent'}
                        label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent')}
                        description={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </Box>
            )}
            <VStack gap="space-16" marginBlock="space-16 space-48">
                <Box>
                    <Heading size={'small'}>
                        {t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studietsLengde')}
                    </Heading>
                    <BodyShort textColor={'subtle'}>
                        {t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studietsLengde.beskrivelse')}
                    </BodyShort>
                </Box>
                <Datovelger
                    name={'utdanning.naavaerendeUtdanning.startDato'}
                    label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.startDato')}
                    minDate={state.foedselsdato}
                    maxDate={addYears(new Date(), 1)}
                />
                <Datovelger
                    name={'utdanning.naavaerendeUtdanning.sluttDato'}
                    label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.sluttDato')}
                    minDate={minSluttDato(startDatoUtdanning)}
                    maxDate={addYears(new Date(), 10)}
                />

                <RHFSpoersmaalRadio
                    name={`utdanning.naavaerendeUtdanning.godkjentUtdanning` as const}
                    legend={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.godkjentUtdanning')}
                    vetIkke
                />

                <RHFSpoersmaalRadio
                    name={'utdanning.aktivitetsplan.svar'}
                    legend={t('merOmSituasjonenDin.utdanning.aktivitetsplan.svar')}
                />

                <br />
                <RHFCheckboksGruppe
                    name={'utdanning.soeknadOmSkolepenger'}
                    legend={t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger')}
                    description={t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.beskrivelse')}
                    required={false}
                    checkboxes={[
                        {
                            children: t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.bekreftelse'),
                            value: IValg.JA,
                        },
                    ]}
                />

                <RHFCheckboksGruppe
                    name={'utdanning.soeknadOmTilleggsstoenadUtdanning'}
                    legend={t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning')}
                    description={t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.beskrivelse')}
                    required={false}
                    checkboxes={[
                        {
                            children: t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse'),
                            value: IValg.JA,
                        },
                    ]}
                />
            </VStack>
        </Box>
    )
}

export default UnderUtdanning
