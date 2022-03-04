import { Heading } from '@navikt/ds-react'
import { RadioProps } from 'nav-frontend-skjema'
import { BankkontoType } from '../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../hooks/useTranslation'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput } from '../../common/rhf/RHFInput'
import { RHFInlineRadio } from '../../common/rhf/RHFRadio'
import FormElement from '../../common/FormElement'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import styled from 'styled-components'

const HelpTextLabel = styled.div`
    display: flex;
`

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
                <FormElement>
                    <RHFInlineRadio
                        name={'paymentDetails.accountType'}
                        legend={t('accountType')}
                        radios={Object.values(BankkontoType).map((value) => {
                            return { label: t(value), value } as RadioProps
                        })}
                    />
                </FormElement>
            )}

            {accountType === BankkontoType.NORSK && (
                <FormElement>
                    <RHFKontonummerInput
                        bredde={'S'}
                        name={'paymentDetails.bankAccount'}
                        label={t('bankAccount')}
                        description={t('information')}
                    />
                </FormElement>
            )}

            {accountType === BankkontoType.UTENLANDSK && (
                <>
                    <Heading size={'small'}>{t('title')}</Heading>

                    <FormElement>
                        <RHFInput name={'paymentDetails.foreignBankName'} label={t('foreignBankName')} />
                    </FormElement>

                    <FormElement>
                        <RHFInput name={'paymentDetails.foreignBankAddress'} label={t('foreignBankAddress')} />
                    </FormElement>

                    <FormElement>
                        <RHFIbanInput
                            name={'paymentDetails.iban'}
                            label={
                                <HelpTextLabel>
                                    {t('iban')}
                                    &nbsp;
                                    <Hjelpetekst>{t('ibanHelpText')}</Hjelpetekst>
                                </HelpTextLabel>
                            }
                        />
                    </FormElement>
                    <FormElement>
                        <RHFBicInput
                            name={'paymentDetails.swift'}
                            label={
                                <HelpTextLabel>
                                    {t('swift')}
                                    &nbsp;
                                    <Hjelpetekst>{t('swiftHelpText')}</Hjelpetekst>
                                </HelpTextLabel>
                            }
                        />
                    </FormElement>
                </>
            )}
        </>
    )
}
