import { createContext, FC, useContext, useReducer } from 'react'
import mockChildJson from '../../assets/mocks/mock-child.json'
import mockGuardianJson from '../../assets/mocks/mock-guardian.json'
import mockParentJson from '../../assets/mocks/mock-parent.json'
import { ActionTypes, ApplicationProps, IApplication, IApplicationAction } from './application'

const initialState: IApplication = {}

const reducer = (state: IApplication, action: IApplicationAction) => {
    switch (action.type) {
        case ActionTypes.MOCK_PARENT_APPLICATION: {
            const json = JSON.stringify(mockParentJson)
            return JSON.parse(json) as IApplication
        }
        case ActionTypes.MOCK_GUARDIAN_APPLICATION: {
            const json = JSON.stringify(mockGuardianJson)
            return JSON.parse(json) as IApplication
        }
        case ActionTypes.MOCK_CHILD_APPLICATION: {
            const json = JSON.stringify(mockChildJson)
            return JSON.parse(json) as IApplication
        }
        case ActionTypes.RESET:
            return initialState
        case ActionTypes.SET_APPLICATION:
            return action.payload
        case ActionTypes.SAVE_APPLICATION: {
            return {
                ...state,
                meta: {
                    ...state.meta,
                    readyForSaving: false,
                },
            }
        }
        case ActionTypes.UPDATE_APPLICANT: {
            return {
                ...state,
                applicant: {
                    ...state.applicant,
                    ...action.payload,
                },
                meta: {
                    ...state.meta,
                    readyForSaving: true,
                },
            }
        }
        case ActionTypes.UPDATE_ABOUT_YOU:
            return {
                ...state,
                aboutYou: action.payload,
                meta: {
                    ...state.meta,
                    readyForSaving: true,
                },
            }
        case ActionTypes.UPDATE_FIRST_PARENT:
            return {
                ...state,
                firstParent: action.payload,
                meta: {
                    ...state.meta,
                    readyForSaving: true,
                },
            }
        case ActionTypes.UPDATE_SECOND_PARENT:
            return {
                ...state,
                secondParent: action.payload,
                meta: {
                    ...state.meta,
                    readyForSaving: true,
                },
            }
        case ActionTypes.UPDATE_ABOUT_CHILDREN: {
            return {
                ...state,
                aboutChildren: action.payload,
                meta: {
                    ...state.meta,
                    readyForSaving: true,
                },
            }
        }
        default:
            return state
    }
}

export const ApplicationContext = createContext<ApplicationProps>({
    state: initialState,
    dispatch: () => {},
})

const useApplicationContext = () => useContext(ApplicationContext)

const ApplicationProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <ApplicationContext.Provider value={{ state, dispatch }}>{children}</ApplicationContext.Provider>
}

export { useApplicationContext, ApplicationProvider }
