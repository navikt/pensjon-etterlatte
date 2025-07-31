import { Heading, HelpText, HStack, RadioProps, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { BankkontoType } from '~api/dto/FellesOpplysninger'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ApplicantRole } from '~types/applicant'
import { IAboutChildren, IAboutYou } from '~types/person'
import { Bredde } from '~utils/bredde'
import useTranslation from '../../hooks/useTranslation'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput } from './rhf/RHFInput'
import { RHFRadio } from './rhf/RHFRadio'

export default function PaymentDetails() {
    const { t } = useTranslation('paymentDetails')
    const { state } = useApplicationContext()
    const { watch } = useFormContext<IAboutYou | IAboutChildren>()

    const accountType = watch('paymentDetails.accountType')

    const isParent = state.applicant?.applicantRole === ApplicantRole.PARENT

    return (
        <VStack marginBlock="4 8" gap="4">
            <RHFRadio
                id={'accountTypeSelection'}
                name={'paymentDetails.accountType'}
                legend={t('accountType')}
                children={Object.values(BankkontoType).map((value) => {
                    return { children: t(value), value } as RadioProps
                })}
            />

            {accountType === BankkontoType.NORSK && (
                <RHFKontonummerInput
                    name={'paymentDetails.bankAccount'}
                    label={t('bankAccount')}
                    description={isParent && t('bankAccountDescription')}
                    htmlSize={Bredde.XS}
                />
            )}

            {accountType === BankkontoType.UTENLANDSK && (
                <>
                    <Heading size={'small'}>{t('title')}</Heading>

                    <VStack marginBlock="4" gap="4">
                        <RHFInput name={'paymentDetails.foreignBankName'} label={t('foreignBankName')} />
                        <RHFInput name={'paymentDetails.foreignBankAddress'} label={t('foreignBankAddress')} />
                        <RHFIbanInput
                            name={'paymentDetails.iban'}
                            label={
                                <HStack gap="1">
                                    {t('iban')}
                                    <HelpText placement={'top'}>{t('ibanHelpText')}</HelpText>
                                </HStack>
                            }
                            htmlSize={Bredde.M}
                        />
                        <RHFBicInput
                            name={'paymentDetails.swift'}
                            label={
                                <HStack gap="1">
                                    {t('swift')}
                                    <HelpText placement={'top'}>{t('swiftHelpText')}</HelpText>
                                </HStack>
                            }
                            htmlSize={Bredde.S}
                        />
                    </VStack>
                </>
            )}
        </VStack>
    )
}
