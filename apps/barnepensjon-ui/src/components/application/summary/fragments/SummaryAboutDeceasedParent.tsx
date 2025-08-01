import { Box, Panel, Tag } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { IDeceasedParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
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
            <Box marginBlock="4">
                <PersonInfoSummary
                    firstName={aboutTheParent.firstName}
                    lastName={aboutTheParent.lastName}
                    fnrDnr={aboutTheParent.fnrDnr}
                    dateOfBirth={aboutTheParent.dateOfBirth}
                    citizenship={aboutTheParent.citizenship}
                />
                <TextGroup title={t('dateOfDeath')} content={aboutTheParent.dateOfDeath.toString()} />
                <TextGroupJaNeiVetIkke title={t('occupationalInjury')} content={aboutTheParent.occupationalInjury} />
                <TextGroupJaNeiVetIkke
                    title={t('didTheDeceasedLiveAbroad')}
                    content={aboutTheParent.staysAbroad.hasStaysAbroad}
                />
                {aboutTheParent.staysAbroad.abroadStays?.map((stay) => (
                    <Panel key={uuid()}>
                        <Tag variant={'neutral-moderate'}>{`Opphold i ${stay.country}`}</Tag>
                        <TextGroup title={t('abroadInWhichCountry')} content={stay.country} />
                        <TextGroup
                            title={t('livedOrWorkedAbroad')}
                            content={stay.type?.map((item) => ` ${t(item)}`).toString()}
                        />
                        {stay.toDate && <TextGroup title={t('stayedAbroadToDate')} content={stay.toDate.toString()} />}
                        {stay.fromDate && (
                            <TextGroup title={t('stayedAbroadFromDate')} content={stay.fromDate.toString()} />
                        )}
                        <TextGroupJaNeiVetIkke
                            title={t('deceasedWasMemberOfFolketrygdenAbroad')}
                            content={stay.medlemFolketrygd}
                        />

                        {stay.pension.amount && <TextGroup title={t('amountAbroad')} content={stay.pension.amount} />}

                        {stay.pension.currency && (
                            <TextGroup title={t('chooseCurrency', { ns: 'common' })} content={stay.pension.currency} />
                        )}
                    </Panel>
                ))}
            </Box>
        </AccordionItem>
    )
})
