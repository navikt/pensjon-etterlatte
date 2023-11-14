import { IValg } from '../../../../typer/Spoersmaal'
import { useFormContext } from 'react-hook-form'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import Datovelger from '../../../felles/Datovelger'
import { ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from '../../../../utils/dato'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import { HGrid } from '@navikt/ds-react'

const TidligereSamboerMedAvdoede = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoekerOgAvdoed>()
    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const datoForInngaattSamboerskap: any = watch('forholdTilAvdoede.datoForInngaattSamboerskap')
    const datoForSamlivsbrudd: any = watch('forholdTilAvdoede.datoForSamlivsbrudd')
    const datoForDoedsfallet: Date = soknadState.omDenAvdoede.datoForDoedsfallet!!
    const fellesBarn = watch('forholdTilAvdoede.fellesBarn')

    const bidragMaaUtfylles = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(datoForSamlivsbrudd, datoForDoedsfallet)

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                />
            </SkjemaElement>

            {fellesBarn === IValg.JA && (
                <>
                    {/* TODO: Burde være eget felt for inngått samboerskap? */}
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

                    {bidragMaaUtfylles && (
                        <RHFSpoersmaalRadio
                            name={'forholdTilAvdoede.mottokBidrag'}
                            legend={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag')}
                        />
                    )}
                </>
            )}
        </SkjemaGruppe>
    )
}

export default TidligereSamboerMedAvdoede
