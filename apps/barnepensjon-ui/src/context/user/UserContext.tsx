import React, { createContext, FC, useContext, useReducer } from 'react'
import { ActionTypes, User, IBrukerAction, StegProps } from './user'
import { FCProps } from '../../types/FCProps'

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

const UserContext = createContext<StegProps>({
    state: initialState,
    dispatch: () => {},
})

const useUserContext = () => useContext(UserContext)

const UserProvider: FC<FCProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
}

export { useUserContext, UserProvider }
