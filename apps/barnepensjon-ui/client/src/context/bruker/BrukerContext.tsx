import { createContext, FC, useContext, useReducer } from 'react'
import { ActionTypes, User, IBrukerAction, StegProps } from './bruker'

const initialState: User = {}

const reducer = (state: User, action: IBrukerAction) => {
    switch (action.type) {
        case ActionTypes.RESET: {
            return {}
        }
        case ActionTypes.SET_USER: {
            return action.payload as User
        }
        default:
            return { ...state }
    }
}

const StegContext = createContext<StegProps>({
    state: initialState,
    dispatch: () => {},
})

const useBrukerContext = () => useContext(StegContext)

const BrukerProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <StegContext.Provider value={{ state, dispatch }}>{children}</StegContext.Provider>
}

export { useBrukerContext, BrukerProvider }
