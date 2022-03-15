import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { BankkontoType, JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { User } from '../../../../context/user/user'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutYou } from '../../../../types/person'
import { StepPath } from '../../../../types/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import TextGroup from '../TextGroup'

export const SummeryAboutYou = memo(
    ({ aboutYou, user, pathPrefix }: { aboutYou: IAboutYou; user: User; pathPrefix: string }) => {
        const { t } = useTranslation('aboutYou')

        return (
            <>
                {!isEmpty(aboutYou) && (
                    <FormElement>
                        <Accordion>
                            <AccordionItem
                                title={t('title')}
                                path={`/skjema/${pathPrefix}/steg/${StepPath.AboutYou}`}
                                pathText={t(`changeAnswerSummary.${StepPath.AboutYou}`)}
                            >
                                <>
                                    <Panel>
                                        <Heading size={'small'}>{t('subtitle.personalia')}</Heading>
                                        <TextGroup title={t('name')} content={`${user.fornavn} ${user.etternavn}`} />
                                        <TextGroup title={t('fnr')} content={user.foedselsnummer} />
                                        {!user.adressebeskyttelse && (
                                            <TextGroup
                                                title={t('address')}
                                                content={`${user.adresse} ${user.husnummer}${user.husbokstav || ''}, ${
                                                    user.postnummer
                                                } ${user.poststed}`}
                                            />
                                        )}

                                        <TextGroup title={t('citizenship')} content={user.statsborgerskap} />
                                    </Panel>

                                    <Panel>
                                        <Heading size={'small'}>{t('subtitle.informationAboutApplicant')}</Heading>
                                        <TextGroup
                                            title={t('addressOfResidenceConfirmed')}
                                            content={aboutYou.addressOfResidenceConfirmed}
                                        />
                                        {aboutYou.addressOfResidenceConfirmed === JaNeiVetIkke.NEI && (
                                            <TextGroup
                                                title={t('alternativeAddress')}
                                                content={aboutYou.alternativeAddress}
                                            />
                                        )}
                                        {aboutYou.paymentDetails && (
                                            <>
                                                <TextGroup
                                                    title={t('paymentDetails.accountType')}
                                                    content={aboutYou.paymentDetails.accountType}
                                                />
                                                {aboutYou.paymentDetails.accountType === BankkontoType.UTENLANDSK && (
                                                    <>
                                                        <TextGroup
                                                            title={t('paymentDetails.foreignBankName')}
                                                            content={aboutYou.paymentDetails.foreignBankName}
                                                        />
                                                        <TextGroup
                                                            title={t('paymentDetails.foreignBankAddress')}
                                                            content={aboutYou.paymentDetails.foreignBankAddress}
                                                        />
                                                        <TextGroup
                                                            title={t('paymentDetails.iban')}
                                                            content={aboutYou.paymentDetails.iban}
                                                        />
                                                        <TextGroup
                                                            title={t('paymentDetails.swift')}
                                                            content={aboutYou.paymentDetails.swift}
                                                        />
                                                    </>
                                                )}
                                                {aboutYou.paymentDetails.accountType === BankkontoType.NORSK && (
                                                    <TextGroup
                                                        title={t('paymentDetails.bankAccount')}
                                                        content={aboutYou.paymentDetails.bankAccount}
                                                    />
                                                )}

                                                <TextGroup
                                                    title={t('paymentDetails.taxWithhold.answer')}
                                                    content={aboutYou.paymentDetails.taxWithhold?.answer}
                                                />
                                                {aboutYou.paymentDetails.taxWithhold?.answer === JaNeiVetIkke.JA && (
                                                    <TextGroup
                                                        title={t('paymentDetails.taxWithhold.taxPercentage')}
                                                        content={aboutYou.paymentDetails.taxWithhold?.taxPercentage}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </Panel>
                                </>
                            </AccordionItem>
                        </Accordion>
                    </FormElement>
                )}
            </>
        )
    }
)
