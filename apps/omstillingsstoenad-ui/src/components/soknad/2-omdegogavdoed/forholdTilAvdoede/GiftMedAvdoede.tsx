import Datovelger from '../../../felles/Datovelger'
import { useFormContext } from 'react-hook-form'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'

const GiftMedAvdoede = () => {
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
                    label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')}
                    minDate={state.foedselsdato}
                    maxDate={datoforDoedsfallet || new Date()}
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                />
            </SkjemaElement>

            {ingenFellesBarn && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={'forholdTilAvdoede.omsorgForBarn'}
                        legend={t('omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn')}
                    />
                </SkjemaElement>
            )}
        </>
    )
}

export default GiftMedAvdoede
