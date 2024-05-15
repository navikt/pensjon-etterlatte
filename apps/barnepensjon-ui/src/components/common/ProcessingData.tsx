import React from 'react'
import { TFunction } from '../../hooks/useTranslation'
import FormGroup from './FormGroup'
import { BodyLong, ExpansionCard, Heading, List } from '@navikt/ds-react'
import FormElement from './FormElement'
import Trans from './Trans'
import { ListItemWithIndent } from '../FrontPage'

export function ProcessingDataParentAndGuardian({ t, isParent }: { t: TFunction; isParent: boolean }) {
    return (
        <FormGroup>
            <ExpansionCard aria-label={t('weWillRetrieveInfoTitle')}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title as={'h2'} size={'small'}>
                        {t('weWillRetrieveInfoTitle')}
                    </ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <FormElement>
                        <Heading size={'xsmall'}>{t('howWeProcessDataTitle')}</Heading>
                        <BodyLong>
                            {t(isParent ? 'howWeProcessDataContentParent' : 'howWeProcessDataContentGuardian')}
                        </BodyLong>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('collectAndProcessTitle')}</Heading>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>
                                {t(isParent ? 'collectAndProcess_li1_parent' : 'collectAndProcess_li1_guardian')}
                            </ListItemWithIndent>
                            <ListItemWithIndent>{t('collectAndProcess_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('collectAndProcess_li3')}</ListItemWithIndent>
                        </List>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('weWillRetrieveInfo')}</Heading>
                        <BodyLong>{t(isParent ? 'infoWeRetrieve_parent' : 'infoWeRetrieve_guardian')}</BodyLong>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('infoWeRetrieve_li1')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('infoWeRetrieve_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('infoWeRetrieve_li3')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('infoWeRetrieve_li4')}</ListItemWithIndent>
                        </List>

                        <BodyLong>
                            {t(isParent ? 'survivingParentInfo_parent' : 'survivingParentInfo_guardian')}
                        </BodyLong>
                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('survivingParentInfo_li1')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li3')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li4')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li5')}</ListItemWithIndent>
                        </List>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('disclosureOfInformationTitle')}</Heading>
                        <BodyLong>{t('disclosureOfInformationContent')}</BodyLong>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('durationDataIsStoredTitle')}</Heading>
                        <BodyLong>{t('durationDataIsStoredContent')}</BodyLong>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('automaticProcessingTitle')}</Heading>
                        <BodyLong>{t('automaticProcessingContent1')}</BodyLong>
                        <FormElement>
                            <BodyLong>
                                <Trans value={t('automaticProcessingContent2')} />
                            </BodyLong>
                        </FormElement>
                        <FormElement>
                            <BodyLong>{t('automaticProcessingContent3')}</BodyLong>
                        </FormElement>
                        <BodyLong>{t('automaticProcessingContent4')}</BodyLong>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('automaticProcessingContent_li1')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('automaticProcessingContent_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('automaticProcessingContent_li3')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('automaticProcessingContent_li4')}</ListItemWithIndent>
                        </List>
                        <BodyLong>{t('automaticProcessingContent5')}</BodyLong>
                    </FormElement>

                    <Heading size={'xsmall'}>{t('aboutPrivacyTitle')}</Heading>
                    <BodyLong>
                        <Trans value={t('aboutPrivacy')} />
                    </BodyLong>
                </ExpansionCard.Content>
            </ExpansionCard>
        </FormGroup>
    )
}

export function ProcessingDataChild({ t }: { t: TFunction }) {
    return (
        <FormGroup>
            <ExpansionCard aria-label={t('weWillRetrieveInfoTitle')}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title as={'h2'} size={'small'}>
                        {t('weWillRetrieveInfoTitle')}
                    </ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <FormElement>
                        <Heading size={'xsmall'}>{t('howWeProcessDataTitle')}</Heading>
                        <BodyLong>{t('howWeProcessDataContentChild')}</BodyLong>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('collectAndProcessTitle')}</Heading>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('collectAndProcess_li1_child')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('collectAndProcess_li2_child')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('collectAndProcess_li3')}</ListItemWithIndent>
                        </List>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('weWillRetrieveInfo')}</Heading>
                        <BodyLong>{t('infoWeRetrieve_child')}</BodyLong>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('infoWeRetrieve_li1')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('infoWeRetrieve_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('infoWeRetrieve_li3')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('infoWeRetrieve_li4')}</ListItemWithIndent>
                        </List>

                        <BodyLong>{t('survivingParentInfo_child')}</BodyLong>
                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('survivingParentInfo_li1')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li3')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li4')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('survivingParentInfo_li5')}</ListItemWithIndent>
                        </List>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('disclosureOfInformationTitle_child')}</Heading>
                        <BodyLong>{t('disclosureOfInformationContent')}</BodyLong>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('durationDataIsStoredTitle')}</Heading>
                        <BodyLong>{t('durationDataIsStoredContent')}</BodyLong>
                    </FormElement>

                    <FormElement>
                        <Heading size={'xsmall'}>{t('automaticProcessingTitle')}</Heading>
                        <BodyLong>{t('automaticProcessingContent1_child')}</BodyLong>
                        <FormElement>
                            <BodyLong>
                                <Trans value={t('automaticProcessingContent2_child')} />
                            </BodyLong>
                        </FormElement>
                        <FormElement>
                            <BodyLong>{t('automaticProcessingContent3_child')}</BodyLong>
                        </FormElement>
                        <BodyLong>{t('automaticProcessingContent4')}</BodyLong>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>{t('automaticProcessingContent_li1')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('automaticProcessingContent_li2')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('automaticProcessingContent_li3')}</ListItemWithIndent>
                            <ListItemWithIndent>{t('automaticProcessingContent_li4')}</ListItemWithIndent>
                        </List>
                        <BodyLong>{t('automaticProcessingContent5')}</BodyLong>
                    </FormElement>

                    <Heading size={'xsmall'}>{t('aboutPrivacyTitle')}</Heading>
                    <BodyLong>
                        <Trans value={t('aboutPrivacy_child')} />
                    </BodyLong>
                </ExpansionCard.Content>
            </ExpansionCard>
        </FormGroup>
    )
}
