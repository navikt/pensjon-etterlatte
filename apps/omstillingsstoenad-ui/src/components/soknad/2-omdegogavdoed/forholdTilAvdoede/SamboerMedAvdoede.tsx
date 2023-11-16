import { IValg } from '../../../../typer/Spoersmaal'
import { useFormContext } from 'react-hook-form'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import Datovelger from '../../../felles/Datovelger'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'

const SamboerMedAvdoede = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoekerOgAvdoed>()
    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const ingenFellesBarn = watch('forholdTilAvdoede.fellesBarn') === IValg.NEI
    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    return (
        <>
            <SkjemaElement>
                <Datovelger
                    name={'forholdTilAvdoede.datoForInngaattPartnerskap'}
                    label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap')}
                    minDate={state.foedselsdato}
                    maxDate={datoforDoedsfallet || new Date()}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                    description={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn.beskrivelse')}
                />
            </SkjemaElement>

            {ingenFellesBarn && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={'forholdTilAvdoede.tidligereGift'}
                        legend={t('omDegOgAvdoed.forholdTilAvdoede.tidligereGift')}
                    />
                </SkjemaElement>
            )}
        </>
    )
}

export default SamboerMedAvdoede
