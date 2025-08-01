import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, Box, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react'
import { format } from 'date-fns'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ikon from '../../../assets/barn1.svg'
import useTranslation from '../../../hooks/useTranslation'
import { IChild } from '../../../types/person'

interface Props {
    child: IChild
    index: number
    remove: (index: number) => void
    setActiveChildIndex: () => void
}

const ChildInfoCard = memo(({ child, index, remove, setActiveChildIndex }: Props) => {
    const { t } = useTranslation('aboutChildren')

    const foedselsnummer = child.fnrDnr?.replace(/(\d{6})(.*)/, '$1 $2')
    return (
        <Box background="bg-subtle" marginBlock="0 4" borderRadius="0 0 4 4">
            <Box
                borderRadius="4 4 0 0"
                height="128px"
                borderWidth="0 0 4 0"
                style={{
                    backgroundColor: '#4d3e55',
                    borderBottomColor: '#826ba1',
                }}
            >
                <HStack justify="center" align="end" height="100%">
                    <img alt="barn" src={ikon} />
                </HStack>
            </Box>

            <VStack padding="8" align="center">
                <Heading size={'small'}>
                    {child.firstName} {child.lastName}
                </Heading>
                <Box marginBlock="2">
                    {foedselsnummer && (
                        <>
                            <BodyShort>{t('infoCard_fnr')}</BodyShort>
                            <BodyShort spacing>{foedselsnummer}</BodyShort>
                        </>
                    )}
                    {child.dateOfBirth && (
                        <>
                            <BodyShort>{t('infoCard_dob')}</BodyShort>
                            <BodyShort spacing>{format(child.dateOfBirth, 'dd.MM.yyyy')}</BodyShort>
                        </>
                    )}

                    <BodyShort>{t('infoCard_citizenship')}</BodyShort>
                    <BodyShort spacing>{child.citizenship}</BodyShort>

                    <BodyShort>{t('infoCard_residence')}</BodyShort>
                    <BodyShort spacing>
                        {t('livesIn')}&nbsp;
                        {child.staysAbroad?.answer === JaNeiVetIkke.JA
                            ? child.staysAbroad?.country
                            : t('norway', { ns: 'common' })}
                    </BodyShort>

                    {!!child.appliesForChildrensPension ? (
                        <Box marginBlock="4">
                            <Tag variant={'success'}>{t('childAppliedForPension')}</Tag>
                        </Box>
                    ) : (
                        <Box marginBlock="4">
                            <Tag variant={'warning'}>{t('childNotApplyingForPension')}</Tag>
                        </Box>
                    )}
                </Box>
                <VStack gap="2">
                    <Button
                        type="button"
                        icon={<EditFilled fontSize={18} aria-hidden />}
                        onClick={setActiveChildIndex}
                        variant="tertiary"
                    >
                        {t('editButton', { ns: 'btn' })}
                    </Button>
                    <Button
                        type="button"
                        icon={<DeleteFilled fontSize={18} aria-hidden />}
                        onClick={() => remove(index)}
                        variant="tertiary"
                    >
                        {t('removeChildButton')}
                    </Button>
                </VStack>
            </VStack>
        </Box>
    )
})

export default ChildInfoCard
