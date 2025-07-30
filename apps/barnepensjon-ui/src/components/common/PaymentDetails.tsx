import { Box, Heading, HelpText, RadioProps } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { BankkontoType } from '~api/dto/FellesOpplysninger'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ApplicantRole } from '~types/applicant'
import { IAboutChildren, IAboutYou } from '~types/person'
import { Bredde } from '~utils/bredde'
import useTranslation from '../../hooks/useTranslation'
import FormElement from './FormElement'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput } from './rhf/RHFInput'
import { RHFRadio } from './rhf/RHFRadio'

const HelpTextLabel = styled.div`
    display: flex;
`

export default function PaymentDetails() {
    const { t } = useTranslation('paymentDetails')
    const { state } = useApplicationContext()
    const { watch } = useFormContext<IAboutYou | IAboutChildren>()

    const accountType = watch('paymentDetails.accountType')

    const isParent = state.applicant?.applicantRole === ApplicantRole.PARENT

    return (
        <Box marginBlock="0 8">
            <FormElement>
                <RHFRadio
                    id={'accountTypeSelection'}
                    name={'paymentDetails.accountType'}
                    legend={t('accountType')}
                    children={Object.values(BankkontoType).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                />
            </FormElement>

            {accountType === BankkontoType.NORSK && (
                <>
                    <FormElement>
                        <RHFKontonummerInput
                            name={'paymentDetails.bankAccount'}
                            label={t('bankAccount')}
                            description={isParent && t('bankAccountDescription')}
                            htmlSize={Bredde.XS}
                        />
                    </FormElement>
                </>
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
                                    <HelpText placement={'top'}>{t('ibanHelpText')}</HelpText>
                                </HelpTextLabel>
                            }
                            htmlSize={Bredde.M}
                        />
                    </FormElement>
                    <FormElement>
                        <RHFBicInput
                            name={'paymentDetails.swift'}
                            label={
                                <HelpTextLabel>
                                    {t('swift')}
                                    &nbsp;
                                    <HelpText placement={'top'}>{t('swiftHelpText')}</HelpText>
                                </HelpTextLabel>
                            }
                            htmlSize={Bredde.S}
                        />
                    </FormElement>
                </>
            )}
        </Box>
    )
}
