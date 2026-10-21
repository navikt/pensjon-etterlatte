import { createContext, FC, useContext, useReducer } from 'react'
import { FCProps } from '../../typer/FCProps'
import { ActionTypes, BrukerProps, IBruker, IBrukerAction } from './bruker'

const initialState: IBruker = {}

const reducer = (state: IBruker, action: IBrukerAction): IBruker => {
    switch (action.type) {
        case ActionTypes.TILBAKESTILL:
            return {}
        case ActionTypes.HENT_INNLOGGET_BRUKER:
            return action.payload
        default:
            return state
    }
}

const BrukerContext = createContext<BrukerProps>({
    state: initialState,
    dispatch: () => {},
})

const useBrukerContext = () => useContext(BrukerContext)

const BrukerProvider: FC<FCProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <BrukerContext.Provider value={{ state, dispatch }}>{children}</BrukerContext.Provider>
}

export { BrukerProvider, useBrukerContext }
