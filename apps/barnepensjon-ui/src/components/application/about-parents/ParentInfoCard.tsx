import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, Button, ErrorMessage, Heading, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import ikon from '../../../assets/ukjent_person.svg'
import useTranslation from '../../../hooks/useTranslation'
import { Infocard, InfocardHeader, InformationBox, InformationElement } from '../../common/card/InfoCard'
import { IParent } from '~context/application/application'

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
        <Infocard $hasError={!isValidated} id={firstParent ? 'deceasedParentOne' : 'deceasedParentTwo'}>
            <InfocardHeader>
                <img alt="forelder" src={ikon} />
            </InfocardHeader>

            <InformationBox>
                <BodyShort weight="semibold">{t('deceasedParent', { ns: 'aboutParents' })}</BodyShort>

                <Heading size={'small'} spacing>
                    {parent.firstName} {parent.lastName}
                </Heading>
                <InformationElement>
                    {/* TODO: Endre fnr / dnr tekst dynamisk ? */}
                    <BodyShort>{t('fnrDnr')}</BodyShort>
                    <BodyShort spacing>{foedselsnummer ?? '-'}</BodyShort>

                    <BodyShort>{t('citizenship')}</BodyShort>
                    <BodyShort spacing>{parent.citizenship ?? '-'}</BodyShort>
                </InformationElement>
                <VStack gap="4">
                    {!isValidated && <ErrorMessage>{t('missingInformation', { ns: 'aboutParents' })}</ErrorMessage>}

                    <VStack gap="2" align="center">
                        <Button type="button" icon={<EditFilled fontSize={18} />} onClick={edit} variant="tertiary">
                            {t('editButton', { ns: 'btn' })}
                        </Button>
                        <Button type="button" icon={<DeleteFilled fontSize={18} />} onClick={remove} variant="tertiary">
                            {t('removeButton', { ns: 'btn' })}
                        </Button>
                    </VStack>
                </VStack>
            </InformationBox>
        </Infocard>
    )
})

export default ParentInfoCard
