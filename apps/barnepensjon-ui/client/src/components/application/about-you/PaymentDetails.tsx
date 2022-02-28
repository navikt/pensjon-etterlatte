import { Heading } from '@navikt/ds-react'
import { RadioProps } from 'nav-frontend-skjema'
import { BankkontoType } from '../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../hooks/useTranslation'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import FormGroup from '../../common/FormGroup'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput } from '../../common/rhf/RHFInput'
import { RHFInlineRadio } from '../../common/rhf/RHFRadio'

export default function PaymentDetails({
    hideSelectType,
    accountType,
}: {
    hideSelectType?: boolean
    accountType: BankkontoType
}) {
    const { t } = useTranslation('paymentDetails')

    return (
        <>
            {!hideSelectType && (
                <RHFInlineRadio
                    name={'accountType'}
                    legend={t('accountType')}
                    radios={Object.values(BankkontoType).map((value) => {
                        return { label: t(value), value } as RadioProps
                    })}
                />
            )}

            {accountType === BankkontoType.NORSK && (
                <FormGroup>
                    <RHFKontonummerInput
                        bredde={'S'}
                        name={'bankAccount'}
                        label={t('bankAccount')}
                        description={t('information')}
                    />
                </FormGroup>
            )}

            {accountType === BankkontoType.UTENLANDSK && (
                <>
                    <FormGroup>
                        <Heading size={'small'}>{t('title')}</Heading>
                    </FormGroup>

                    <RHFInput name={'foreignBankName'} label={t('foreignBankName')} />

                    <RHFInput name={'foreignBankAddress'} label={t('foreignBankAddress')} />

                    <RHFIbanInput
                        name={'iban'}
                        label={
                            <>
                                {t('iban')}
                                &nbsp;
                                <Hjelpetekst>{t('ibanHelpText')}</Hjelpetekst>
                            </>
                        }
                    />

                    <RHFBicInput
                        name={'swift'}
                        label={
                            <>
                                {t('swift')}
                                &nbsp;
                                <Hjelpetekst>{t('swiftHelpText')}</Hjelpetekst>
                            </>
                        }
                    />
                </>
            )}
        </>
    )
}
