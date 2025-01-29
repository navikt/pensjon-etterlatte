import { BankkontoType, JaNeiVetIkke, OppholdUtlandType } from "../../api/dto/FellesOpplysninger";
import { IAboutChildren, IAboutYou } from "../../types/person";
import { ISituationChild } from "../../types/situation";
import { Language } from "../language/language";
import { ApplicantRole, ApplicantSituation } from "../../types/applicant";

export const emptyApplication: IApplication = {
    aboutYou: { paymentDetails: { accountType: BankkontoType.NORSK } },
};

export interface IApplication {
    meta?: IApplicationMeta;
    applicant?: IApplicant;
    aboutYou: IAboutYou;
    yourSituation?: ISituationChild;
    firstParent?: IParent | IDeceasedParent;
    secondParent?: IParent | IDeceasedParent;
    unknownParent?: boolean;
    aboutChildren?: IAboutChildren;
}

export enum ActionTypes {
    MOCK_PARENT_APPLICATION,
    MOCK_GUARDIAN_APPLICATION,
    MOCK_CHILD_SINGLE_DEAD_APPLICATION,
    MOCK_CHILD_BOTH_DEAD_APPLICATION,
    SET_APPLICATION,
    SAVE_APPLICATION,
    UPDATE_ABOUT_CHILDREN,
    UPDATE_APPLICANT,
    UPDATE_ABOUT_YOU,
    UPDATE_FIRST_PARENT,
    UPDATE_SECOND_PARENT,
    UPDATE_UNKNOWN_PARENT,
    UPDATE_YOUR_SITUATION,
    UPDATE_LANGUAGE,
    RESET,
    CLOSE_CONTINUE_MODAL,
}

export interface IApplicationAction {
    type: ActionTypes;
    // biome-ignore lint/suspicious/noExplicitAny: disabler nå for å få det til å funke
    payload?: any;
}

export interface ApplicationProps {
    state: IApplication;
    dispatch: (action: IApplicationAction) => void;
}

export interface IApplicationMeta {
    readyForSaving?: boolean;
    savedTimestamp?: Date;
    showContinueModal?: boolean;
    currentPath?: string;
    language?: Language;
}

export interface IApplicant {
    consent: boolean;
    applicantRole: ApplicantRole;
    applicantSituation?: ApplicantSituation;
}

export interface IParent {
    firstName: string;
    lastName: string;
    fnrDnr: string;
    fnrIsUnknown?: boolean;
    dateOfBirth?: string;
    citizenship: string;
}

export interface ILivingParent extends IParent {
    address?: string;
    phoneNumber?: string;
}

export interface IDeceasedParent extends IParent {
    dateOfDeath: Date;
    staysAbroad: IStaysAbroad;
    occupationalInjury?: JaNeiVetIkke;
    isValidated?: boolean;
}

export interface IStaysAbroad {
    hasStaysAbroad: JaNeiVetIkke;
    abroadStays?: IAbroadStay[];
}

export interface IAbroadStay {
    country: string;
    fromDate?: Date;
    toDate?: Date;
    type: OppholdUtlandType[];
    medlemFolketrygd: JaNeiVetIkke;
    pension: {
        amount?: string;
        currency?: string;
    };
}
