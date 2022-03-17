import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { IDeceasedParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'
import { PersonInfoSummary } from './PersonInfoSummery'

export const SummaryAboutDeceasedParent = memo(
    ({ aboutTheParent, pathPrefix }: { aboutTheParent: IDeceasedParent; pathPrefix: string }) => {
        const { t } = useTranslation('aboutTheDeceased')

        return (
            <>
                {!isEmpty(aboutTheParent) && (
                    <FormElement>
                        <Accordion>
                            <AccordionItem
                                title={t('singleParentTitle')}
                                path={`/skjema/${pathPrefix}/${StepPath.AboutTheParents}`}
                                pathText={t(StepLabelKey.AboutTheParents, { ns: 'summary' })}
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
                                            <Heading size={'small'}>{`Opphold i ${stay.country}`}</Heading>
                                            <TextGroup title={t('abroadInWhichCountry')} content={stay.country} />
                                            <TextGroup
                                                title={t('livedOrWorkedAbroad')}
                                                content={stay.type?.map((item) => ` ${t(item)}`)}
                                            />
                                            {stay.toDate && (
                                                <TextGroup title={t('stayedAbroadToDate')} content={stay.toDate} />
                                            )}
                                            {stay.fromDate && (
                                                <TextGroup title={t('stayedAbroadFromDate')} content={stay.fromDate} />
                                            )}
                                            <TextGroup
                                                title={t('deceasedWasMemberOfFolketrygdenAbroad')}
                                                content={stay.medlemFolketrygd}
                                            />

                                            {stay.pensionAmount && (
                                                <TextGroup
                                                    title={t('pensionReceivedFromAbroad')}
                                                    content={stay.pensionAmount}
                                                />
                                            )}
                                        </Panel>
                                    ))}
                                    <TextGroupJaNeiVetIkke
                                        title={t('wasTheDeceasedSelfEmployed')}
                                        content={aboutTheParent.selfEmplyment.wasSelfEmployed}
                                    />
                                    {aboutTheParent.selfEmplyment?.selfEmplymentDetails?.income && (
                                        <TextGroup
                                            title={t('incomeFromSelfEmployymentYearBeforeDeath')}
                                            content={aboutTheParent.selfEmplyment.selfEmplymentDetails.income}
                                        />
                                    )}
                                    {aboutTheParent.selfEmplyment?.selfEmplymentDetails?.incomeAtDeath && (
                                        <TextGroup
                                            title={t('hadIncomeFromSelfEmployment')}
                                            content={aboutTheParent.selfEmplyment.selfEmplymentDetails.incomeAtDeath}
                                        />
                                    )}
                                    <TextGroupJaNeiVetIkke
                                        title={t('occupationalInjury')}
                                        content={aboutTheParent.occupationalInjury}
                                    />
                                    <TextGroupJaNeiVetIkke
                                        title={t('deceasedHasServedInTheMilitary')}
                                        content={aboutTheParent.militaryService?.completed}
                                    />
                                    {aboutTheParent.militaryService?.period && (
                                        <TextGroup
                                            title={t('militaryServiceYears')}
                                            content={aboutTheParent.militaryService?.period}
                                        />
                                    )}
                                </FormElement>
                            </AccordionItem>
                        </Accordion>
                    </FormElement>
                )}
            </>
        )
    }
)
