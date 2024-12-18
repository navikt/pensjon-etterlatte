import { BankkontoType } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import { TextGroup } from '../TextGroup'
import { IPaymentDetails } from '../../../../types/person'

export default function PaymentDetailsSummary({ paymentDetails }: { paymentDetails: IPaymentDetails }) {
    const { t } = useTranslation('paymentDetails')

    const { accountType, bankAccount, foreignBankName, foreignBankAddress, iban, swift } = paymentDetails

    return (
        <>
            <TextGroup title={t('accountType')} content={t(accountType)} />

            {accountType === BankkontoType.NORSK && <TextGroup title={t('bankAccount')} content={bankAccount} />}
            {accountType === BankkontoType.UTENLANDSK && (
                <>
                    <TextGroup title={t('foreignBankName')} content={foreignBankName} />
                    <TextGroup title={t('foreignBankAddress')} content={foreignBankAddress} />
                    <TextGroup title={t('iban')} content={iban} />
                    <TextGroup title={t('swift')} content={swift} />
                </>
            )}
        </>
    )
}
