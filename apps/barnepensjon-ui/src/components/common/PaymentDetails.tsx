import { Alert, BodyShort, Heading, HelpText, Panel, RadioProps } from '@navikt/ds-react'
import styled from 'styled-components'
import { BankkontoType, JaNeiVetIkke } from '../../api/dto/FellesOpplysninger'
import useTranslation from '../../hooks/useTranslation'
import FormElement from './FormElement'
import { RHFGeneralQuestionRadio, RHFInlineRadio } from './rhf/RHFRadio'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from './rhf/RHFInput'
import FormGroup from './FormGroup'
import WhyWeAsk from './WhyWeAsk'
import { useFormContext } from 'react-hook-form'
import { IAboutChildren, IAboutYou } from '../../types/person'

const HelpTextLabel = styled.div`
    display: flex;
`

export default function PaymentDetails() {
    const { t } = useTranslation('paymentDetails')

    const { watch } = useFormContext<IAboutYou | IAboutChildren>()

    const accountType = watch('paymentDetails.accountType')
    const withholdingTaxChildrensPension = watch('paymentDetails.taxWithhold.answer')

    return (
        <FormGroup>
            <FormElement>
                <RHFInlineRadio
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
                            description={t('information')}
                            htmlSize={15}
                        />
                    </FormElement>
                    <FormElement>
                        <RHFGeneralQuestionRadio
                            id={'taxWithholdAnswer'}
                            name={'paymentDetails.taxWithhold.answer'}
                            legend={t('doYouWantUsToWithholdTax')}
                            description={<WhyWeAsk title={'tax'}>{t('childPensionIsTaxable')}</WhyWeAsk>}
                        />
                    </FormElement>

                    {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                        <>
                            <FormElement>
                                <RHFProsentInput
                                    name={'paymentDetails.taxWithhold.taxPercentage'}
                                    label={t('desiredTaxPercentage')}
                                    placeholder={t('desiredTaxPercentagePlaceholder')}
                                    htmlSize={40}
                                />
                            </FormElement>
                            <FormElement>
                                <Panel border>
                                    <Alert variant={'info'} inline>
                                        <BodyShort size={'small'}>{t('taxWithholdMustBeSentYearly')}</BodyShort>
                                    </Alert>
                                </Panel>
                            </FormElement>
                        </>
                    )}
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
                        />
                    </FormElement>
                </>
            )}
        </FormGroup>
    )
}
