import { Box, HGrid } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import { antallAarMellom } from '../../../../utils/dato'
import Datovelger from '../../../felles/Datovelger'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

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
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const datoForInngaattPartnerskap: any = watch('forholdTilAvdoede.datoForInngaattPartnerskap')
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const datoForSkilsmisse: any = watch('forholdTilAvdoede.datoForSkilsmisse')

    const fellesBarn = watch('forholdTilAvdoede.fellesBarn')
    const mottokBidrag = watch('forholdTilAvdoede.mottokBidrag.svar')

    const mindreEnn15aar = giftMindreEnn15aar(datoForInngaattPartnerskap, datoForSkilsmisse)

    return (
        <Box marginBlock="0 12">
            <Box marginBlock="4">
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
            </Box>

            <RHFSpoersmaalRadio
                name={'forholdTilAvdoede.fellesBarn'}
                legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                description={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn.beskrivelse')}
            />

            {fellesBarn === IValg.JA && mindreEnn15aar === IValg.JA && (
                <Box marginBlock="4">
                    <RHFSpoersmaalRadio
                        name={'forholdTilAvdoede.samboereMedFellesBarn'}
                        legend={t('omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn')}
                    />
                </Box>
            )}

            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.mottokBidrag.svar'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.svar')}
                    description={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.beskrivelse')}
                />
            </Box>

            {mottokBidrag === IValg.JA && (
                <Box marginBlock="4">
                    <RHFValutaInput
                        name={'forholdTilAvdoede.mottokBidrag.sum'}
                        label={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum')}
                        description={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum.beskrivelse')}
                    />
                </Box>
            )}
        </Box>
    )
}

export default SkiltFraAvdoede
