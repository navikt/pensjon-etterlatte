import { createContext, FC, useContext, useReducer } from 'react'
import { ActionTypes, IBruker, IBrukerAction, StegProps } from './bruker'
import { FCProps } from '../../typer/FCProps'

const initialState: IBruker = {}

const reducer = (state: IBruker, action: IBrukerAction) => {
    switch (action.type) {
        case ActionTypes.TILBAKESTILL: {
            return {}
        }
        case ActionTypes.HENT_INNLOGGET_BRUKER: {
            return action.payload as IBruker
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

const BrukerProvider: FC<FCProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <StegContext.Provider value={{ state, dispatch }}>{children}</StegContext.Provider>
}

export { useBrukerContext, BrukerProvider }
