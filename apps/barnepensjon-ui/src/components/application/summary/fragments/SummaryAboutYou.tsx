import { memo } from 'react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { User } from '../../../../context/user/user'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutYou } from '../../../../types/person'
import { fullAdresse } from '../../../../utils/personalia'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import { SummaryGroup } from '../SummaryGroup'
import { SummarySection } from '../SummarySection'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'
import PaymentDetailsSummary from './PaymentDetailsSummary'
import PersonInfoSummary from './PersonInfoSummary'

interface Props {
    aboutYou: IAboutYou
    user: User
    pathPrefix: string
}

export const SummaryAboutYou = memo(({ aboutYou, user, pathPrefix }: Props) => {
    const { t } = useTranslation('aboutYou')

    const isGuardian = pathPrefix === 'verge'

    return (
        <SummarySection
            title={isGuardian ? t('titleGuardian') : t('title')}
            path={`/skjema/${pathPrefix}/${StepPath.AboutYou}`}
            pathText={t(StepLabelKey.AboutYou, { ns: 'summary' })}
        >
            <SummaryGroup title={t('subtitle.personalia')}>
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
            </SummaryGroup>

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
                        <TextGroup
                            title={t('stayedAbroadFromDate')}
                            content={aboutYou.stayedAbroadFromDate.toString()}
                        />
                    )}
                    {aboutYou.stayedAbroadToDate && (
                        <TextGroup title={t('stayedAbroadToDate')} content={aboutYou.stayedAbroadToDate.toString()} />
                    )}
                </>
            )}

            {aboutYou.residesInNorway === JaNeiVetIkke.NEI && (
                <TextGroup title={t('countryOfResidence')} content={aboutYou.countryOfResidence} />
            )}

            {aboutYou.disabilityBenefits && (
                <TextGroupJaNeiVetIkke title={t('disabilityBenefits')} content={aboutYou.disabilityBenefits} />
            )}

            {aboutYou.workAssessmentAllowance && (
                <TextGroupJaNeiVetIkke
                    title={t('workAssessmentAllowance')}
                    content={aboutYou.workAssessmentAllowance}
                />
            )}

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
        </SummarySection>
    )
})
