import { Heading, Panel, Tag } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { IDeceasedParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'
import PersonInfoSummary from './PersonInfoSummary'

interface Props {
    aboutTheParent: IDeceasedParent
    pathPrefix: string
}

export const SummaryAboutDeceasedParent = memo(({ aboutTheParent, pathPrefix }: Props) => {
    const { t } = useTranslation('aboutTheDeceased')
    if (!aboutTheParent || isEmpty(aboutTheParent)) return null
    const isVergeOrBarn = pathPrefix === 'verge' || pathPrefix === 'barn'

    return (
        <AccordionItem
            title={t('singleParentTitle')}
            path={`/skjema/${pathPrefix}/${isVergeOrBarn ? StepPath.AboutTheParents : StepPath.AboutTheDeceased}`}
            pathText={t(isVergeOrBarn ? StepLabelKey.AboutTheParents : StepLabelKey.AboutTheDeceased, {
                ns: 'summary',
            })}
        >
            <FormElement>
                <PersonInfoSummary
                    firstName={aboutTheParent.firstName}
                    lastName={aboutTheParent.lastName}
                    fnrDnr={aboutTheParent.fnrDnr}
                    citizenship={aboutTheParent.citizenship}
                />
                <TextGroup title={t('dateOfDeath')} content={aboutTheParent.dateOfDeath} />
                <TextGroupJaNeiVetIkke
                    title={t('didTheDeceasedLiveAbroad')}
                    content={aboutTheParent.staysAbroad.hasStaysAbroad}
                />
                {aboutTheParent.staysAbroad.abroadStays?.map((stay) => (
                    <Panel key={uuid()}>
                        <Tag variant={'neutral-moderate'}>{`Opphold i ${stay.country}`}</Tag>
                        <TextGroup title={t('abroadInWhichCountry')} content={stay.country} />
                        <TextGroup title={t('livedOrWorkedAbroad')} content={stay.type?.map((item) => ` ${t(item)}`)} />
                        {stay.toDate && <TextGroup title={t('stayedAbroadToDate')} content={stay.toDate} />}
                        {stay.fromDate && <TextGroup title={t('stayedAbroadFromDate')} content={stay.fromDate} />}
                        <TextGroupJaNeiVetIkke
                            title={t('deceasedWasMemberOfFolketrygdenAbroad')}
                            content={stay.medlemFolketrygd}
                        />

                        {stay.pensionAmount && (
                            <TextGroup title={t('pensionReceivedFromAbroad')} content={stay.pensionAmount} />
                        )}
                    </Panel>
                ))}
                {aboutTheParent.selfEmplyment?.wasSelfEmployed && (
                    <TextGroupJaNeiVetIkke
                        title={t('wasTheDeceasedSelfEmployed')}
                        content={aboutTheParent.selfEmplyment.wasSelfEmployed}
                    />
                )}
                {aboutTheParent.selfEmplyment?.selfEmplymentDetails?.income && (
                    <TextGroup
                        title={t('incomeFromSelfEmployymentYearBeforeDeath')}
                        content={aboutTheParent.selfEmplyment.selfEmplymentDetails.income}
                    />
                )}
                {aboutTheParent.selfEmplyment?.selfEmplymentDetails?.incomeAtDeath && (
                    <TextGroupJaNeiVetIkke
                        title={t('hadIncomeFromSelfEmployment')}
                        content={aboutTheParent.selfEmplyment.selfEmplymentDetails.incomeAtDeath}
                    />
                )}
                <TextGroupJaNeiVetIkke title={t('occupationalInjury')} content={aboutTheParent.occupationalInjury} />
                {aboutTheParent.militaryService?.completed && (
                    <TextGroupJaNeiVetIkke
                        title={t('deceasedHasServedInTheMilitary')}
                        content={aboutTheParent.militaryService?.completed}
                    />
                )}
                {aboutTheParent.militaryService?.period && (
                    <TextGroup title={t('militaryServiceYears')} content={aboutTheParent.militaryService?.period} />
                )}
            </FormElement>
        </AccordionItem>
    )
})
