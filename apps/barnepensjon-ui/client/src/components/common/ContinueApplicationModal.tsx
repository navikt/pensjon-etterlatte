import { Button, Heading } from '@navikt/ds-react'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import useTranslation from '../../hooks/useTranslation'
import EyModal from './EyModal'
import { deleteDraft } from '../../api/api'
import { ActionTypes } from '../../context/application/application'
import { useNavigate } from 'react-router-dom'
import FormElement from './FormElement'

export const ContinueApplicationModal = () => {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation('continueApplicationModal')
    const navigate = useNavigate()

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
        <EyModal open={state.meta?.showContinueModal || false} onClose={() => {}}>
            <Heading size={'medium'}>{t('doYouWantToContinueWithTheApplication')}</Heading>

            <FormElement>
                <Button variant={'primary'} type={'button'} onClick={continueApplication}>
                    {t('yesContinueWithApplication')}
                </Button>
            </FormElement>

            <FormElement>
                <Button variant={'primary'} type={'button'} onClick={newApplication}>
                    {t('noRestartApplication')}
                </Button>
            </FormElement>
        </EyModal>
    )
}
