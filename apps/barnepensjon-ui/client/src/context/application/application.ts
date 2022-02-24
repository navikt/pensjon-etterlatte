export interface IApplication {
    aboutYou?: any
}

export enum ActionTypes {
    UPDATE_ABOUT_YOU,
    RESET,
}

export interface IApplicationAction {
    type: ActionTypes
    payload?: any
}

export interface ApplicationProps {
    state: IApplication
    dispatch: (action: IApplicationAction) => void
}
