import { BodyLong, Box, ExpansionCard, Heading, List, VStack } from '@navikt/ds-react'
import React from 'react'
import { TFunction } from '../../hooks/useTranslation'
import Trans from './Trans'

export function ProcessingDataParentAndGuardian({ t, isParent }: { t: TFunction; isParent: boolean }) {
    return (
        <Box marginBlock="space-0 space-32">
            <ExpansionCard aria-label={t('weWillRetrieveInfoTitle')}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title as={'h2'} size={'small'}>
                        {t('weWillRetrieveInfoTitle')}
                    </ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <VStack marginBlock="space-16" gap="space-16">
                        <VStack>
                            <Heading size={'small'}>{t('howWeProcessDataTitle')}</Heading>
                            <BodyLong>
                                {t(isParent ? 'howWeProcessDataContentParent' : 'howWeProcessDataContentGuardian')}
                            </BodyLong>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('collectAndProcessTitle')}</Heading>

                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>
                                        {t(
                                            isParent ? 'collectAndProcess_li1_parent' : 'collectAndProcess_li1_guardian'
                                        )}
                                    </List.Item>
                                    <List.Item>{t('collectAndProcess_li2')}</List.Item>
                                    <List.Item>{t('collectAndProcess_li3')}</List.Item>
                                </List>
                            </Box>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('weWillRetrieveInfo')}</Heading>
                            <BodyLong>{t(isParent ? 'infoWeRetrieve_parent' : 'infoWeRetrieve_guardian')}</BodyLong>

                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('infoWeRetrieve_li1')}</List.Item>
                                    <List.Item>{t('infoWeRetrieve_li2')}</List.Item>
                                    <List.Item>{t('infoWeRetrieve_li3')}</List.Item>
                                    <List.Item>{t('infoWeRetrieve_li4')}</List.Item>
                                </List>
                            </Box>

                            <BodyLong>
                                {t(isParent ? 'survivingParentInfo_parent' : 'survivingParentInfo_guardian')}
                            </BodyLong>
                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('survivingParentInfo_li1')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li2')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li3')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li4')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li5')}</List.Item>
                                </List>
                            </Box>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('disclosureOfInformationTitle')}</Heading>
                            <BodyLong>{t('disclosureOfInformationContent')}</BodyLong>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('durationDataIsStoredTitle')}</Heading>
                            <BodyLong>{t('durationDataIsStoredContent')}</BodyLong>
                        </VStack>

                        <VStack>
                            <Heading size={'small'}>{t('automaticProcessingTitle')}</Heading>
                            <BodyLong>{t('automaticProcessingContent1')}</BodyLong>
                            <VStack marginBlock="space-16" gap="space-16">
                                <BodyLong>
                                    <Trans value={t('automaticProcessingContent2')} />
                                </BodyLong>
                                <BodyLong>{t('automaticProcessingContent3')}</BodyLong>
                            </VStack>
                            <BodyLong>{t('automaticProcessingContent4')}</BodyLong>

                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('automaticProcessingContent_li1')}</List.Item>
                                    <List.Item>{t('automaticProcessingContent_li2')}</List.Item>
                                    <List.Item>{t('automaticProcessingContent_li3')}</List.Item>
                                    <List.Item>{t('automaticProcessingContent_li4')}</List.Item>
                                </List>
                            </Box>
                            <BodyLong>{t('automaticProcessingContent5')}</BodyLong>
                        </VStack>
                    </VStack>

                    <Heading size={'small'}>{t('aboutPrivacyTitle')}</Heading>
                    <BodyLong>
                        <Trans value={t('aboutPrivacy')} />
                    </BodyLong>
                </ExpansionCard.Content>
            </ExpansionCard>
        </Box>
    )
}

export function ProcessingDataChild({ t }: { t: TFunction }) {
    return (
        <Box marginBlock="space-0 space-32">
            <ExpansionCard aria-label={t('weWillRetrieveInfoTitle')}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title as={'h2'} size={'small'}>
                        {t('weWillRetrieveInfoTitle')}
                    </ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <VStack marginBlock="space-16" gap="space-16">
                        <VStack>
                            <Heading size={'small'}>{t('howWeProcessDataTitle')}</Heading>
                            <BodyLong>{t('howWeProcessDataContentChild')}</BodyLong>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('collectAndProcessTitle')}</Heading>

                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('collectAndProcess_li1_child')}</List.Item>
                                    <List.Item>{t('collectAndProcess_li2_child')}</List.Item>
                                    <List.Item>{t('collectAndProcess_li3')}</List.Item>
                                </List>
                            </Box>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('weWillRetrieveInfo')}</Heading>
                            <BodyLong>{t('infoWeRetrieve_child')}</BodyLong>

                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('infoWeRetrieve_li1')}</List.Item>
                                    <List.Item>{t('infoWeRetrieve_li2')}</List.Item>
                                    <List.Item>{t('infoWeRetrieve_li3')}</List.Item>
                                    <List.Item>{t('infoWeRetrieve_li4')}</List.Item>
                                </List>
                            </Box>

                            <BodyLong>{t('survivingParentInfo_child')}</BodyLong>
                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('survivingParentInfo_li1')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li2')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li3')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li4')}</List.Item>
                                    <List.Item>{t('survivingParentInfo_li5')}</List.Item>
                                </List>
                            </Box>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('disclosureOfInformationTitle_child')}</Heading>
                            <BodyLong>{t('disclosureOfInformationContent')}</BodyLong>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('durationDataIsStoredTitle')}</Heading>
                            <BodyLong>{t('durationDataIsStoredContent')}</BodyLong>
                        </VStack>
                        <VStack>
                            <Heading size={'small'}>{t('automaticProcessingTitle')}</Heading>
                            <BodyLong>{t('automaticProcessingContent1_child')}</BodyLong>
                            <VStack marginBlock="space-16" gap="space-16">
                                <BodyLong>
                                    <Trans value={t('automaticProcessingContent2_child')} />
                                </BodyLong>
                                <BodyLong>{t('automaticProcessingContent3_child')}</BodyLong>
                            </VStack>
                            <BodyLong>{t('automaticProcessingContent4')}</BodyLong>

                            <Box marginInline="space-16 space-0">
                                <List as={'ul'}>
                                    <List.Item>{t('automaticProcessingContent_li1')}</List.Item>
                                    <List.Item>{t('automaticProcessingContent_li2')}</List.Item>
                                    <List.Item>{t('automaticProcessingContent_li3')}</List.Item>
                                    <List.Item>{t('automaticProcessingContent_li4')}</List.Item>
                                </List>
                            </Box>
                            <BodyLong>{t('automaticProcessingContent5')}</BodyLong>
                        </VStack>
                    </VStack>

                    <Heading size={'small'}>{t('aboutPrivacyTitle')}</Heading>
                    <BodyLong>
                        <Trans value={t('aboutPrivacy')} />
                    </BodyLong>
                </ExpansionCard.Content>
            </ExpansionCard>
        </Box>
    )
}
