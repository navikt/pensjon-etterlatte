import { BankkontoType, IUtbetalingsInformasjon } from '../../../../typer/utbetaling'
import { useTranslation } from 'react-i18next'
import { TekstGruppe } from './TekstGruppe'

export default function UtbetalingsInformasjonOppsummering({
    utbetalingsInformasjon,
}: {
    utbetalingsInformasjon: IUtbetalingsInformasjon
}) {
    const { t } = useTranslation()

    const { bankkontoType, kontonummer, utenlandskBankNavn, utenlandskBankAdresse, iban, swift } =
        utbetalingsInformasjon

    return (
        <>
            <TekstGruppe tittel={t('omDeg.utbetalingsInformasjon.bankkontoType')} innhold={t(bankkontoType)} />

            {bankkontoType === BankkontoType.norsk && (
                <TekstGruppe tittel={t('omDeg.utbetalingsInformasjon.kontonummer')} innhold={kontonummer} />
            )}
            {bankkontoType === BankkontoType.utenlandsk && (
                <>
                    <TekstGruppe
                        tittel={t('omDeg.utbetalingsInformasjon.utenlandskBankNavn')}
                        innhold={utenlandskBankNavn}
                    />
                    <TekstGruppe
                        tittel={t('omDeg.utbetalingsInformasjon.utenlandskBankAdresse')}
                        innhold={utenlandskBankAdresse}
                    />
                    <TekstGruppe tittel={t('omDeg.utbetalingsInformasjon.iban')} innhold={iban} />
                    <TekstGruppe tittel={t('omDeg.utbetalingsInformasjon.swift')} innhold={swift} />
                </>
            )}
        </>
    )
}
