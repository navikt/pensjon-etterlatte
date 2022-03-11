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
import { UseFormWatch } from 'react-hook-form/dist/types/form'

const HelpTextLabel = styled.div`
    display: flex;
`

export default function PaymentDetails({
    accountTypeLocked,
    statePrefix,
    watch,
}: {
    accountTypeLocked?: BankkontoType
    statePrefix?: String
    watch: UseFormWatch<any>
}) {
    const { t } = useTranslation('paymentDetails')
    const prefix = statePrefix ? `${statePrefix}.` : ''
    const withholdingTaxChildrensPension = watch(`${prefix}paymentDetails.taxWithhold.answer`)
    const accountType = watch(`${prefix}paymentDetails.accountType`)

    return (
        <FormGroup>
            {!accountTypeLocked && (
                <FormElement>
                    <RHFInlineRadio
                        name={`${prefix}paymentDetails.accountType`}
                        legend={t('accountType')}
                        radios={Object.values(BankkontoType).map((value) => {
                            return { label: t(value), value } as RadioProps
                        })}
                    />
                </FormElement>
            )}

            {(accountType === BankkontoType.NORSK || accountTypeLocked === BankkontoType.NORSK) && (
                <FormElement>
                    <RHFKontonummerInput
                        bredde={'S'}
                        name={`${prefix}paymentDetails.bankAccount`}
                        label={t('bankAccount')}
                        description={t('information')}
                    />
                </FormElement>
            )}

            {(accountType === BankkontoType.UTENLANDSK || accountTypeLocked === BankkontoType.UTENLANDSK) && (
                <>
                    <Heading size={'small'}>{t('title')}</Heading>

                    <FormElement>
                        <RHFInput name={`${prefix}paymentDetails.foreignBankName`} label={t('foreignBankName')} />
                    </FormElement>

                    <FormElement>
                        <RHFInput name={`${prefix}paymentDetails.foreignBankAddress`} label={t('foreignBankAddress')} />
                    </FormElement>

                    <FormElement>
                        <RHFIbanInput
                            name={`${prefix}paymentDetails.iban`}
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
                            name={`${prefix}paymentDetails.swift`}
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
                    name={`${prefix}paymentDetails.taxWithhold.answer`}
                    legend={t('taxWithhold.answer')}
                    description={<WhyWeAsk title={'tax'}>{t('taxWithhold.helpText')}</WhyWeAsk>}
                />
            </FormElement>

            {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                <>
                    <FormElement>
                        <RHFProsentInput
                            bredde={'M'}
                            name={`${prefix}paymentDetails.taxWithhold.taxPercentage`}
                            label={t('taxWithhold.taxPercentage')}
                            placeholder={t('taxWithhold.taxPercentage')}
                        />
                    </FormElement>
                    <FormElement>
                        <Panel border>
                            <Alert variant={'info'} className={'navds-alert--inline'}>
                                <BodyShort size={'small'}>{t('taxWithhold.info')}</BodyShort>
                            </Alert>
                        </Panel>
                    </FormElement>
                </>
            )}
        </FormGroup>
    )
}
