import { BankkontoType } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import TextGroup from '../TextGroup'
import TextGroupJaNeiVetIkke from '../TextGroupJaNeiVetIkke'

export const PaymentDetailsSummary = ({
    accountType,
    bankAccount,
    taxWithholdAnswer,
    taxWithholdPercentage,
    foreignBankName,
    foreignBankAddress,
    iban,
    swift,
}: any) => {
    const { t } = useTranslation('paymentDetails')

    return (
        <>
            <TextGroup title={t('accountType')} content={accountType} />
            {accountType === BankkontoType.NORSK && <TextGroup title={t('bankAccount')} content={bankAccount} />}
            {accountType === BankkontoType.UTENLANDSK && (
                <>
                    <TextGroup title={t('foreignBankName')} content={foreignBankName} />
                    <TextGroup title={t('foreignBankAddress')} content={foreignBankAddress} />
                    <TextGroup title={t('iban')} content={iban} />
                    <TextGroup title={t('swift')} content={swift} />
                </>
            )}
            {taxWithholdAnswer && (
                <>
                    <TextGroupJaNeiVetIkke title={t('doYouWantUsToWithholdTax')} content={taxWithholdAnswer} />
                    {taxWithholdPercentage && (
                        <TextGroup title={t('desiredTaxPercentage')} content={taxWithholdPercentage} />
                    )}
                </>
            )}
        </>
    )
}
