import { IValg } from '../../../../typer/Spoersmaal'
import { useFormContext } from 'react-hook-form'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { hentAlder } from '../../../../utils/dato'
import Datovelger from '../../../felles/Datovelger'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'

const SamboerMedAvdoede = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoekerOgAvdoed>()
    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const datoInngaattPartnerskap = watch('forholdTilAvdoede.datoForInngaattPartnerskap')
    const ingenFellesBarn = watch('forholdTilAvdoede.fellesBarn') === IValg.NEI
    const tidligereGift = watch('forholdTilAvdoede.tidligereGift')
    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const partnerskapMindreEnnFemAar = !!datoInngaattPartnerskap ? hentAlder(datoInngaattPartnerskap) < 5 : false

    return (
        <>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
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

            {tidligereGift === IValg.JA && (
                <>
                    <SkjemaGruppe>
                        <Datovelger
                            name={'forholdTilAvdoede.datoForInngaattPartnerskap'}
                            label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap')}
                            minDate={state.foedselsdato}
                            maxDate={datoforDoedsfallet || new Date()}
                        />
                    </SkjemaGruppe>

                    {partnerskapMindreEnnFemAar && (
                        // TODO: Sjekke om denne kan ha lik tittel som tilsvarende element under GiftMedAvdoede.tsx
                        <RHFSpoersmaalRadio
                            name={'forholdTilAvdoede.omsorgForBarn'}
                            legend={t('omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn')}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default SamboerMedAvdoede
