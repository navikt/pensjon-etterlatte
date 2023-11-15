import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import Datovelger from '../../../felles/Datovelger'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { useFormContext } from 'react-hook-form'
import { antallAarMellom } from '../../../../utils/dato'
import { IValg } from '../../../../typer/Spoersmaal'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import { HGrid } from '@navikt/ds-react'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'

const giftMerEnn25aar = (datoForInngaattPartnerskap: string, datoForSkilsmisse: string): IValg => {
    const antallAarPartnerskap = antallAarMellom(datoForInngaattPartnerskap, datoForSkilsmisse) || 0
    if (antallAarPartnerskap >= 25) {
        return IValg.JA
    }
    return IValg.NEI
}
const giftMindreEnn15aar = (datoForInngaattPartnerskap: string, datoForSkilsmisse: string) => {
    const antallAarPartnerskap = antallAarMellom(datoForInngaattPartnerskap, datoForSkilsmisse) || 0
    if (antallAarPartnerskap < 15) {
        return IValg.JA
    }
    return IValg.NEI
}

const SkiltFraAvdoede = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoekerOgAvdoed>()
    const { state: brukerState } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const datoForInngaattPartnerskap: any = watch('forholdTilAvdoede.datoForInngaattPartnerskap')
    const datoForSkilsmisse: any = watch('forholdTilAvdoede.datoForSkilsmisse')

    const fellesBarn = watch('forholdTilAvdoede.fellesBarn')
    const mottokBidrag = watch('forholdTilAvdoede.mottokBidrag.svar')

    const mindreEnn15aar = giftMindreEnn15aar(datoForInngaattPartnerskap, datoForSkilsmisse)
    const merEnn25aar = giftMerEnn25aar(datoForInngaattPartnerskap, datoForSkilsmisse)

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <HGrid gap={'2'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                    <Datovelger
                        name={'forholdTilAvdoede.datoForInngaattPartnerskap'}
                        label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')}
                        minDate={brukerState.foedselsdato}
                        maxDate={soknadState.omDenAvdoede.datoForDoedsfallet || new Date()}
                    />

                    <Datovelger
                        name={'forholdTilAvdoede.datoForSkilsmisse'}
                        label={t('omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse')}
                        minDate={datoForInngaattPartnerskap}
                        maxDate={soknadState.omDenAvdoede.datoForDoedsfallet || new Date()}
                    />
                </HGrid>
            </SkjemaElement>

            <RHFSpoersmaalRadio
                name={'forholdTilAvdoede.fellesBarn'}
                legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                description={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn.beskrivelse')}
            />

            {fellesBarn === IValg.JA && mindreEnn15aar === IValg.JA && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={'forholdTilAvdoede.samboereMedFellesBarn'}
                        legend={t('omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn')}
                    />
                </SkjemaElement>
            )}

            {merEnn25aar === IValg.JA || (fellesBarn === IValg.JA && mindreEnn15aar === IValg.NEI) ? (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={'forholdTilAvdoede.mottokEktefelleBidrag'}
                        legend={t('omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag')}
                    />
                </SkjemaElement>
            ) : null}

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
        </SkjemaGruppe>
    )
}

export default SkiltFraAvdoede
