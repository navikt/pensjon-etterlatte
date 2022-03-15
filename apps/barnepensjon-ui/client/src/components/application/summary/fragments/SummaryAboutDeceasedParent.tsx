import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { IDeceasedParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import { StepPath } from '../../../../types/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import TextGroup from '../TextGroup'
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
                                title={t('title')}
                                path={`/skjema/${pathPrefix}/steg/${StepPath.AboutTheParents}`}
                                pathText={t(`changeAnswerSummary.${StepPath.AboutTheParents}`)}
                            >
                                <FormElement>
                                    <PersonInfoSummary
                                        firstName={aboutTheParent.firstName}
                                        lastName={aboutTheParent.lastName}
                                        fnrDnr={aboutTheParent.fnrDnr}
                                        citizenship={aboutTheParent.citizenship}
                                    />
                                    <TextGroup title={t('dateOfDeath')} content={aboutTheParent.dateOfDeath} />
                                    <TextGroup
                                        title={t('didTheDeceasedLiveAbroad')}
                                        content={aboutTheParent.staysAbroad.hasStaysAbroad}
                                    />
                                    {aboutTheParent.staysAbroad.abroadStays?.map((stay) => (
                                        <Panel key={uuid()}>
                                            <Heading size={'small'}>{`Opphold i ${stay.country}`}</Heading>
                                            <TextGroup
                                                title={t('staysAbroad.abroadStays.country')}
                                                content={stay.country}
                                            />
                                            <TextGroup
                                                title={t('staysAbroad.abroadStays.type')}
                                                content={stay.type?.map((item) => ` ${t(item)}`)}
                                            />
                                            {stay.toDate && (
                                                <TextGroup
                                                    title={t('staysAbroad.abroadStays.toDate')}
                                                    content={stay.toDate}
                                                />
                                            )}
                                            {stay.fromDate && (
                                                <TextGroup
                                                    title={t('staysAbroad.abroadStays.fromDate')}
                                                    content={stay.fromDate}
                                                />
                                            )}
                                            <TextGroup
                                                title={t('staysAbroad.abroadStays.medlemFolketrygd')}
                                                content={stay.medlemFolketrygd}
                                            />

                                            {stay.pensionAmount && (
                                                <TextGroup
                                                    title={t('staysAbroad.abroadStays.pensionAmount')}
                                                    content={stay.pensionAmount}
                                                />
                                            )}
                                        </Panel>
                                    ))}
                                    <TextGroup
                                        title={t('selfEmplyment.wasSelfEmployed')}
                                        content={aboutTheParent.selfEmplyment.wasSelfEmployed}
                                    />
                                    {aboutTheParent.selfEmplyment?.selfEmplymentDetails?.income && (
                                        <TextGroup
                                            title={t('selfEmplyment.selfEmplymentDetails.income')}
                                            content={aboutTheParent.selfEmplyment.selfEmplymentDetails.income}
                                        />
                                    )}
                                    {aboutTheParent.selfEmplyment?.selfEmplymentDetails?.incomeAtDeath && (
                                        <TextGroup
                                            title={t('selfEmplyment.selfEmplymentDetails.incomeAtDeath')}
                                            content={aboutTheParent.selfEmplyment.selfEmplymentDetails.incomeAtDeath}
                                        />
                                    )}
                                    <TextGroup
                                        title={t('occupationalInjury')}
                                        content={aboutTheParent.occupationalInjury}
                                    />
                                    <TextGroup
                                        title={t('militaryService.completed')}
                                        content={aboutTheParent.militaryService?.completed}
                                    />
                                    {aboutTheParent.militaryService?.period && (
                                        <TextGroup
                                            title={t('militaryService.period')}
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
