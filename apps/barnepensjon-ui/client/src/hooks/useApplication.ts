import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/user/UserContext'
import { useApplicationContext } from '../context/application/ApplicationContext'
import { useEffect, useState } from 'react'
import { getDraft, saveDraft } from '../api/api'
import { ActionTypes, IApplication } from '../context/application/application'

export default function useApplication() {
    const navigate = useNavigate()

    const { state: user } = useUserContext()
    const { state, dispatch } = useApplicationContext()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user.kanSoeke) return

        console.log('fetchingDraft')
        getDraft()
            .then((application: IApplication | undefined) => {
                console.log('Draft: ', application)
                if (!application?.applicant?.consent) {
                    navigate('/')
                } else {
                    dispatch({ type: ActionTypes.SET_APPLICATION, payload: application })
                }
            })
            .catch((err: Error) => {
                setLoading(false)

                if (err.message === 'FERDIGSTILT') {
                    navigate('/skjema/sendt')
                } else {
                    // TODO: Handle exception
                    navigate('/')
                }
            })
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if (state?.meta?.readyForSaving) {
            const now = new Date()
            console.log('Saving: ', state)

            saveDraft({ ...state, meta: { ...state.meta, savedTimestamp: now, readyForSaving: undefined } })
                .then(() => dispatch({ type: ActionTypes.SAVE_APPLICATION, payload: now }))
                .catch(() => {
                    // TODO: Handle exception
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.meta?.readyForSaving])

    return loading
}
