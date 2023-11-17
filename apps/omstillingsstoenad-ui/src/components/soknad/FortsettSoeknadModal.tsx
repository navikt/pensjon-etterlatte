import { Button, Heading, Modal } from '@navikt/ds-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes, ActionTypes as SoknadActionTypes } from '../../context/soknad/soknad'
import { StegPath } from '../../typer/steg'
import { slettSoeknad } from '../../api/api'
import { useTranslation } from 'react-i18next'
import { FlexCenter } from '../felles/StyledComponents'

export const FortsettSoeknadModal = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useSoknadContext()
    const { t } = useTranslation()

    const nesteSteg = () => {
        if (state.opplysningerOmBarn.erValidert === true) {
            return StegPath.Oppsummering
        } else if (state.merOmSituasjonenDin.erValidert === true) {
            return StegPath.OmBarn
        } else if (state.situasjonenDin.erValidert === true) {
            return StegPath.MerOmSituasjonenDin
        } else if (state.omDenAvdoede.erValidert === true) {
            return StegPath.SituasjonenDin
        } else if (state.omDegOgAvdoed.erValidert === true) {
            return StegPath.OmAvdoed
        } else if (state.omDeg.erValidert === true) {
            return StegPath.OmDegOgAvdoed
        } else {
            return StegPath.OmDeg
        }
    }

    const fortsettSoeknad = () => {
        const steg = nesteSteg()
        dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false })
        navigate(`/skjema/steg/${steg.valueOf()}`)
    }

    const startPaaNytt = () => {
        slettSoeknad().then(() => {
            dispatch({ type: SoknadActionTypes.TILBAKESTILL })
            dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false })
            navigate('/')
        })
    }

    return (
        <Modal open={state.visFortsettSoeknadModal} onClose={() => {}}>
            <Modal.Header closeButton={false}>
                <Heading size={'medium'}>{t('fortsettSoeknad.beskrivelse')}</Heading>
            </Modal.Header>

            <Modal.Footer>
                <FlexCenter>
                    <Button variant={'secondary'} type={'button'} onClick={startPaaNytt} id={'start_paa_nytt'}>
                        {t('fortsettSoeknad.startPaaNytt')}
                    </Button>
                    <Button variant={'primary'} type={'button'} onClick={fortsettSoeknad} id={'fortsett_soeknad'}>
                        {t('fortsettSoeknad.fortsettSoeknad')}
                    </Button>
                </FlexCenter>
            </Modal.Footer>
        </Modal>
    )
}
