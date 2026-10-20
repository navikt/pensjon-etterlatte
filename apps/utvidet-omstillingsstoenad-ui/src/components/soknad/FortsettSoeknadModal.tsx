import { Button, Heading, Modal } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { slettSoeknad } from '../../api/api'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'

export const FortsettSoeknadModal = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useSoknadContext()
    const { t } = useTranslation()

    const fortsettSoeknad = () => {
        dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false })
        navigate('/skjema/steg')
    }

    const startPaaNytt = () => {
        slettSoeknad().then(() => {
            dispatch({ type: ActionTypes.TILBAKESTILL })
            dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false })
            navigate('/')
        })
    }

    return (
        <Modal open={state.visFortsettSoeknadModal} onClose={() => {}} aria-label={t('fortsettSoeknad.beskrivelse')}>
            <Modal.Header closeButton={false}>
                <Heading size={'medium'}>{t('fortsettSoeknad.beskrivelse')}</Heading>
            </Modal.Header>

            <Modal.Footer>
                <Button variant={'secondary'} type={'button'} onClick={startPaaNytt} id={'start_paa_nytt'}>
                    {t('fortsettSoeknad.startPaaNytt')}
                </Button>
                <Button variant={'primary'} type={'button'} onClick={fortsettSoeknad} id={'fortsett_soeknad'}>
                    {t('fortsettSoeknad.fortsettSoeknad')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
