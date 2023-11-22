import { Heading, Panel } from '@navikt/ds-react'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { User } from '../../../../context/user/user'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutYou } from '../../../../types/person'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
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
                    {aboutYou.residesInNorway && (
                        <TextGroupJaNeiVetIkke title={t('residesInNorway')} content={aboutYou.residesInNorway} />
                    )}
                    {aboutYou.residesInNorway === JaNeiVetIkke.JA && (
                        <TextGroupJaNeiVetIkke title={t('stayedAbroad')} content={aboutYou.stayedAbroad} />
                    )}

                    {aboutYou.stayedAbroad === JaNeiVetIkke.JA && (
                        <>
                            <TextGroup title={t('stayedAbroadCountry')} content={aboutYou.stayedAbroadCountry} />
                            {aboutYou.stayedAbroadFromDate && (
                                <TextGroup title={t('stayedAbroadFromDate')} content={aboutYou.stayedAbroadFromDate} />
                            )}
                            {aboutYou.stayedAbroadToDate && (
                                <TextGroup title={t('stayedAbroadToDate')} content={aboutYou.stayedAbroadToDate} />
                            )}
                        </>
                    )}

                    {aboutYou.residesInNorway === JaNeiVetIkke.NEI && (
                        <TextGroup title={t('countryOfResidence')} content={aboutYou.countryOfResidence} />
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
                    {aboutYou.paymentDetails && <PaymentDetailsSummary paymentDetails={aboutYou.paymentDetails} />}
                </Panel>
            </>
        </AccordionItem>
    )
})
