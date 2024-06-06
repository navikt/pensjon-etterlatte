export interface IUtbetalingsInformasjon {
    bankkontoType: BankkontoType
    kontonummer?: string
    utenlandskBankNavn?: string
    utenlandskBankAdresse?: string
    iban?: string
    swift?: string
}

export enum BankkontoType {
    norsk = 'bankkontoType.norsk',
    utenlandsk = 'bankkontoType.utenlandsk',
}

export enum KronerEllerProsentType {
    kroner = 'felles.kroner',
    prosent = 'felles.prosent',
}
