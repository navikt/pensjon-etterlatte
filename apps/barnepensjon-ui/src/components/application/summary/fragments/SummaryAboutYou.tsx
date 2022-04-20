import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { User } from '../../../../context/user/user'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutYou } from '../../../../types/person'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'
import PaymentDetailsSummary from './PaymentDetailsSummary'
import PersonInfoSummary from './PersonInfoSummary'
import { fullAdresse } from '../../../../utils/personalia'

interface Props {
    aboutYou: IAboutYou
    user: User
    pathPrefix: string
}

export const SummaryAboutYou = memo(({ aboutYou, user, pathPrefix }: Props) => {
    const { t } = useTranslation('aboutYou')

    return (
        <FormElement>
            <Accordion>
                <AccordionItem
                    title={t('title')}
                    path={`/skjema/${pathPrefix}/${StepPath.AboutYou}`}
                    pathText={t(StepLabelKey.AboutYou, { ns: 'summary' })}
                >
                    <>
                        <Panel>
                            <Heading size={'small'}>{t('subtitle.personalia')}</Heading>
                            <PersonInfoSummary
                                name={`${user.fornavn} ${user.etternavn}`}
                                fnrDnr={user.foedselsnummer}
                                citizenship={user.statsborgerskap}
                                address={fullAdresse(user)}
                            />
                            {(user.telefonnummer || aboutYou.phoneNumber) && (
                                <TextGroup
                                    title={t('phoneNumber', { ns: 'common' })}
                                    content={user.telefonnummer || aboutYou.phoneNumber}
                                />
                            )}
                        </Panel>

                        <Panel>
                            {aboutYou.addressOfResidenceConfirmed && (
                                <TextGroupJaNeiVetIkke
                                    title={t('addressOfResidenceConfirmed')}
                                    content={aboutYou.addressOfResidenceConfirmed}
                                />
                            )}
                            {aboutYou.addressOfResidenceConfirmed === JaNeiVetIkke.NEI && (
                                <TextGroup title={t('alternativeAddress')} content={aboutYou.alternativeAddress} />
                            )}
                            {aboutYou.paymentDetails && (
                                <PaymentDetailsSummary paymentDetails={aboutYou.paymentDetails} />
                            )}
                        </Panel>
                    </>
                </AccordionItem>
            </Accordion>
        </FormElement>
    )
})
