import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { User } from '../../../../context/user/user'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutYou } from '../../../../types/person'
import { StepPath } from '../../../../types/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import TextGroup from '../TextGroup'
import TextGroupJaNeiVetIkke from '../TextGroupJaNeiVetIkke'
import { PaymentDetailsSummary } from './PaymentDetailsSummary'
import { PersonInfoSummary } from './PersonInfoSummery'

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
                                        <PersonInfoSummary
                                            name={`${user.fornavn} ${user.etternavn}`}
                                            fnrDnr={user.foedselsnummer}
                                            citizenship={user.statsborgerskap}
                                            address={
                                                !user.adressebeskyttelse
                                                    ? `${user.adresse} ${user.husnummer}${user.husbokstav || ''}, ${
                                                          user.postnummer
                                                      } ${user.poststed}`
                                                    : ''
                                            }
                                        />
                                    </Panel>

                                    <Panel>
                                        <Heading size={'small'}>{t('subtitle.informationAboutApplicant')}</Heading>
                                        <TextGroupJaNeiVetIkke
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
                                            <PaymentDetailsSummary
                                                accountType={aboutYou.paymentDetails?.accountType}
                                                bankAccount={aboutYou.paymentDetails?.bankAccount}
                                                foreignBankName={aboutYou.paymentDetails?.foreignBankName}
                                                foreignBankAddress={aboutYou.paymentDetails?.foreignBankAddress}
                                                iban={aboutYou.paymentDetails?.iban}
                                                swift={aboutYou.paymentDetails?.swift}
                                                taxWithholdAnswer={aboutYou.paymentDetails?.taxWithhold?.answer}
                                                taxWithholdPercentage={
                                                    aboutYou.paymentDetails?.taxWithhold?.taxPercentage
                                                }
                                            />
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
