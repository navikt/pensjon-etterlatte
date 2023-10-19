import { Button, Heading, Modal } from '@navikt/ds-react'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import useTranslation from '../../hooks/useTranslation'
import { deleteDraft } from '../../api/api'
import { ActionTypes } from '../../context/application/application'
import { useLocation, useNavigate } from 'react-router-dom'

export const ContinueApplicationModal = () => {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation('continueApplicationModal')
    const navigate = useNavigate()
    const location = useLocation()

    const disabledSites = ['/ugyldig-soeker', '/skjema/admin', '/system-utilgjengelig']
    const shouldAsk = state.meta?.showContinueModal === true && !disabledSites.includes(location.pathname)

    const continueApplication = () => {
        dispatch({ type: ActionTypes.CLOSE_CONTINUE_MODAL })
        navigate(state.meta?.currentPath || '/')
    }

    const newApplication = () => {
        deleteDraft().then(() => {
            dispatch({ type: ActionTypes.RESET })
            navigate('/')
        })
    }

    return (
        <Modal open={shouldAsk} onClose={() => {}}>
            <Modal.Header>
                <Heading size={'medium'}>{t('doYouWantToContinueWithTheApplication')}</Heading>
            </Modal.Header>

            <Modal.Footer>
                <Button variant={'primary'} type={'button'} onClick={continueApplication}>
                    {t('yesContinueWithApplication')}
                </Button>

                <Button variant={'secondary'} type={'button'} onClick={newApplication}>
                    {t('noRestartApplication')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
