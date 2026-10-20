import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { slettSoeknad } from '../../api/api'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import { stegUrl } from '../../typer/steg'

export const FortsettSoeknadModal = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useSoknadContext()
    const { t } = useTranslation()
    const [sletter, settSletter] = useState(false)
    const [feil, settFeil] = useState(false)

    const fortsettSoeknad = () => {
        dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false })
        navigate(stegUrl(state.aktivtSteg))
    }

    const startPaaNytt = async () => {
        if (sletter) return
        settSletter(true)
        settFeil(false)
        try {
            await slettSoeknad()
            dispatch({ type: ActionTypes.TILBAKESTILL })
            dispatch({ type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL, payload: false })
            navigate('/')
        } catch {
            settFeil(true)
        } finally {
            settSletter(false)
        }
    }

    return (
        <Modal open={state.visFortsettSoeknadModal} onClose={() => {}} aria-label={t('fortsettSoeknad.beskrivelse')}>
            <Modal.Header closeButton={false}>
                <Heading size={'medium'}>{t('fortsettSoeknad.beskrivelse')}</Heading>
            </Modal.Header>
            {feil && (
                <Modal.Body>
                    <BodyShort role="alert">{t('skjema.avslutningFeilet')}</BodyShort>
                </Modal.Body>
            )}

            <Modal.Footer>
                <Button
                    variant={'secondary'}
                    type={'button'}
                    onClick={startPaaNytt}
                    id={'start_paa_nytt'}
                    loading={sletter}
                >
                    {t('fortsettSoeknad.startPaaNytt')}
                </Button>
                <Button
                    variant={'primary'}
                    type={'button'}
                    onClick={fortsettSoeknad}
                    id={'fortsett_soeknad'}
                    disabled={sletter}
                >
                    {t('fortsettSoeknad.fortsettSoeknad')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
