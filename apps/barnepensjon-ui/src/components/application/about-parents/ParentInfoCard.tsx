import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, Box, Button, ErrorMessage, Heading, HStack, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import { IParent } from '~context/application/application'
import ikon from '../../../assets/ukjent_person.svg'
import useTranslation from '../../../hooks/useTranslation'

interface Props {
    parent: IParent
    edit: () => void
    remove: () => void
    isValidated?: boolean
    firstParent: boolean
}

const ParentInfoCard = memo(({ parent, edit, remove, isValidated, firstParent }: Props) => {
    const { t } = useTranslation('common')
    const foedselsnummer = parent.fnrDnr?.replace(/(\d{6})(.*)/, '$1 $2')

    return (
        <Box
            id={firstParent ? 'deceasedParentOne' : 'deceasedParentTwo'}
            background="bg-subtle"
            marginBlock="0 4"
            borderRadius="0 0 4 4"
            style={
                !isValidated
                    ? {
                          border: '1px solid var(--a-red-500)',
                          boxShadow: '0 0 0 1px var(--a-red-500, var(--a-red-500, var(--a-red-500)))',
                      }
                    : {}
            }
        >
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
                    <img alt="forelder" src={ikon} />
                </HStack>
            </Box>

            <VStack padding="8" align="center">
                <BodyShort weight="semibold">{t('deceasedParent', { ns: 'aboutParents' })}</BodyShort>

                <Heading size={'small'} spacing>
                    {parent.firstName} {parent.lastName}
                </Heading>
                <Box paddingBlock="2">
                    {/* TODO: Endre fnr / dnr tekst dynamisk ? */}
                    <BodyShort>{t('fnrDnr')}</BodyShort>
                    <BodyShort spacing>{foedselsnummer ?? '-'}</BodyShort>

                    <BodyShort>{t('citizenship')}</BodyShort>
                    <BodyShort spacing>{parent.citizenship ?? '-'}</BodyShort>
                </Box>
                <VStack gap="4">
                    {!isValidated && <ErrorMessage>{t('missingInformation', { ns: 'aboutParents' })}</ErrorMessage>}

                    <VStack gap="2" align="center">
                        <Button
                            type="button"
                            icon={<EditFilled fontSize={18} aria-hidden />}
                            onClick={edit}
                            variant="tertiary"
                        >
                            {t('editButton', { ns: 'btn' })}
                        </Button>
                        <Button
                            type="button"
                            icon={<DeleteFilled fontSize={18} aria-hidden />}
                            onClick={remove}
                            variant="tertiary"
                        >
                            {t('removeButton', { ns: 'btn' })}
                        </Button>
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    )
})

export default ParentInfoCard
