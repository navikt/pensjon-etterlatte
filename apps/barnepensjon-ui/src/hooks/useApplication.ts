import { useLocation, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/user/UserContext'
import { useApplicationContext } from '../context/application/ApplicationContext'
import { useEffect, useState } from 'react'
import { getDraft, saveDraft } from '../api/api'
import { ActionTypes, IApplication } from '../context/application/application'
import { useLanguageContext } from '../context/language/LanguageContext'

export default function useApplication() {
    const navigate = useNavigate()
    const location = useLocation()

    const { state: user } = useUserContext()
    const { state, dispatch } = useApplicationContext()
    const { updateLanguage } = useLanguageContext()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user.kanSoeke) {
            setLoading(false)
            return
        }

        if (['/skjema/kvittering', '/skjema/admin'].includes(location.pathname)) return

        getDraft()
            .then((application: IApplication | undefined) => {
                if (!application?.applicant?.consent) {
                    navigate('/')
                } else {
                    dispatch({ type: ActionTypes.SET_APPLICATION, payload: application })
                    if (application.meta?.language) updateLanguage(application.meta?.language)
                }
            })
            .catch((err: Error) => {
                setLoading(false)

                if (err.message === 'FERDIGSTILT') {
                    navigate('/skjema/kvittering')
                } else {
                    // TODO: Handle exception
                    navigate('/')
                }
            })
            .finally(() => setLoading(false))
    }, [user])

    useEffect(() => {
        if (state?.meta?.readyForSaving) {
            const now = new Date()

            saveDraft({
                ...state,
                meta: { ...state.meta, savedTimestamp: now, readyForSaving: undefined, currentPath: location.pathname },
            })
                .then(() =>
                    dispatch({
                        type: ActionTypes.SAVE_APPLICATION,
                        payload: { now: now, currentPath: location.pathname },
                    })
                )
                .catch(() => {
                    // TODO: Handle exception
                })
        }
    }, [state?.meta?.readyForSaving])

    return loading
}
