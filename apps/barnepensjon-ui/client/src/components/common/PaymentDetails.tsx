import { Alert, BodyShort, Heading, Panel } from '@navikt/ds-react'
import { RadioProps } from 'nav-frontend-skjema'
import styled from 'styled-components'
import { BankkontoType, JaNeiVetIkke } from '../../api/dto/FellesOpplysninger'
import useTranslation from '../../hooks/useTranslation'
import FormElement from './FormElement'
import { RHFGeneralQuestionRadio, RHFInlineRadio } from './rhf/RHFRadio'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from './rhf/RHFInput'
import Hjelpetekst from '../../utils/Hjelpetekst'
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
                    name={'paymentDetails.accountType'}
                    legend={t('accountType')}
                    radios={Object.values(BankkontoType).map((value) => {
                        return { label: t(value), value } as RadioProps
                    })}
                />
            </FormElement>

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

            <FormElement>
                <RHFGeneralQuestionRadio
                    name={'paymentDetails.taxWithhold.answer'}
                    legend={t('doYouWantUsToWithholdTax')}
                    description={<WhyWeAsk title={'tax'}>{t('childPensionIsTaxable')}</WhyWeAsk>}
                />
            </FormElement>

            {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                <>
                    <FormElement>
                        <RHFProsentInput
                            bredde={'M'}
                            name={'paymentDetails.taxWithhold.taxPercentage'}
                            label={t('desiredTaxPercentage')}
                            placeholder={t('desiredTaxPercentagePlaceholder')}
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
        </FormGroup>
    )
}
