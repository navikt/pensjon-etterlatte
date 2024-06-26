import {Alert, BodyShort, Box, Heading, HelpText, Label, Link, RadioProps} from '@navikt/ds-react'
import styled from 'styled-components'
import { BankkontoType, JaNeiVetIkke, KronerEllerProsentType } from '../../api/dto/FellesOpplysninger'
import useTranslation from '../../hooks/useTranslation'
import FormElement from './FormElement'
import { RHFGeneralQuestionRadio, RHFRadio } from './rhf/RHFRadio'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFInputArea, RHFKontonummerInput, RHFProsentInput } from './rhf/RHFInput'
import FormGroup from './FormGroup'
import { useFormContext } from 'react-hook-form'
import { IAboutChildren, IAboutYou } from '../../types/person'
import { Bredde } from '../../utils/bredde'
import { useApplicationContext } from '../../context/application/ApplicationContext'
import { ApplicantRole } from '../../types/applicant'

const HelpTextLabel = styled.div`
    display: flex;
`

export default function PaymentDetails() {
    const { t } = useTranslation('paymentDetails')
    const { state } = useApplicationContext()
    const { watch } = useFormContext<IAboutYou | IAboutChildren>()

    const accountType = watch('paymentDetails.accountType')
    const withholdingTaxChildrensPension = watch('paymentDetails.taxWithhold.answer')
    const withholdingTaxType = watch('paymentDetails.taxWithhold.type')

    const isParent = state.applicant?.applicantRole === ApplicantRole.PARENT

    return (
        <FormGroup>
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
                    <FormGroup>
                        <FormElement>
                            <Label>{t('taxWithholdTitle')}</Label>
                            <BodyShort spacing>{t('taxWithholdDescription1')}</BodyShort>
                            <BodyShort spacing>
                                {t('taxWithholdDescription2')}
                                <Link href={t('taxWithholdDescription2Href')} inlineText>
                                    {t('taxWithholdDescription2HrefText')}
                                </Link>
                                .
                            </BodyShort>
                            <BodyShort spacing>{t('taxWithholdDescription3')}</BodyShort>
                        </FormElement>
                        <FormElement>
                            <RHFGeneralQuestionRadio
                                id={'taxWithholdAnswer'}
                                name={'paymentDetails.taxWithhold.answer'}
                                legend={t('doYouWantUsToWithholdTax')}
                            />
                        </FormElement>

                        {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                            <>
                                <FormElement>
                                    <RHFRadio
                                        name={'paymentDetails.taxWithhold.type'}
                                        legend={t('taxPercentageType')}
                                        children={Object.values(KronerEllerProsentType).map((value) => {
                                            return { children: t(value), value } as RadioProps
                                        })}
                                    />
                                </FormElement>
                                <FormElement>
                                    {withholdingTaxType && (
                                        <RHFProsentInput
                                            name={'paymentDetails.taxWithhold.taxPercentage'}
                                            label={t(
                                                withholdingTaxType === KronerEllerProsentType.KRONER
                                                    ? 'desiredTaxKroner'
                                                    : 'desiredTaxPercentage'
                                            )}
                                            htmlSize={Bredde.XS}
                                        />
                                    )}
                                </FormElement>
                                <FormElement>
                                    <RHFInputArea
                                        name={'paymentDetails.taxWithhold.description'}
                                        label={t('taxPercentageDescription')}
                                        maxLength={200}
                                        valgfri
                                    />
                                </FormElement>
                                <FormElement>
                                    <Box padding="4" borderWidth="1" borderRadius="small">
                                        <Alert variant={'info'} inline>
                                            <BodyShort>{t('taxWithholdMustBeSentYearly')}</BodyShort>
                                        </Alert>
                                    </Box>
                                </FormElement>
                            </>
                        )}
                    </FormGroup>
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
        </FormGroup>
    )
}
