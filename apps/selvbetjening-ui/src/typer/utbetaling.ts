export interface IUtbetalingsInformasjon {
    bankkontoType: BankkontoType;
    kontonummer?: string;
    utenlandskBankNavn?: string;
    utenlandskBankAdresse?: string;
    iban?: string;
    swift?: string;
}

export enum BankkontoType {
    norsk = "Norsk",
    utenlandsk = "Utenlansk"
}
