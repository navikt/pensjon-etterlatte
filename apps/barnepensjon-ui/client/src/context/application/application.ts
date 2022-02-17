export interface IApplication {}

export enum ActionTypes {
    RESET = 'RESET',
}

export interface IApplicationAction {
    type: ActionTypes
    payload?: any
}

export interface ApplicationProps {
    state: IApplication
    dispatch: (action: IApplicationAction) => void
}
