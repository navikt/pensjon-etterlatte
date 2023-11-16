import { IValg } from '../../../../typer/Spoersmaal'
import { useFormContext } from 'react-hook-form'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import Datovelger from '../../../felles/Datovelger'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import { HGrid } from '@navikt/ds-react'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'

const TidligereSamboerMedAvdoede = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoekerOgAvdoed>()
    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const datoForInngaattSamboerskap: any = watch('forholdTilAvdoede.datoForInngaattSamboerskap')
    const mottokBidrag = watch('forholdTilAvdoede.mottokBidrag.svar')
    const datoForDoedsfallet: Date = soknadState.omDenAvdoede.datoForDoedsfallet!!
    const fellesBarn = watch('forholdTilAvdoede.fellesBarn')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <HGrid gap={'2'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                    <Datovelger
                        name={'forholdTilAvdoede.datoForInngaattSamboerskap'}
                        label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap')}
                        minDate={state.foedselsdato}
                        maxDate={datoForDoedsfallet || new Date()}
                    />

                    <Datovelger
                        name={'forholdTilAvdoede.datoForSamlivsbrudd'}
                        label={t('omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd')}
                        minDate={datoForInngaattSamboerskap}
                        maxDate={datoForDoedsfallet || new Date()}
                    />
                </HGrid>
            </SkjemaElement>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                    description={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn.beskrivelse')}
                />
            </SkjemaElement>

            {fellesBarn === IValg.JA && (
                <>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={'forholdTilAvdoede.mottokBidrag.svar'}
                            legend={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.svar')}
                            description={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.beskrivelse')}
                        />
                    </SkjemaElement>

                    {mottokBidrag === IValg.JA && (
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'forholdTilAvdoede.mottokBidrag.sum'}
                                label={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum')}
                                description={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum.beskrivelse')}
                            />
                        </SkjemaElement>
                    )}
                </>
            )}
        </SkjemaGruppe>
    )
}

export default TidligereSamboerMedAvdoede
