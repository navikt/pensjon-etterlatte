import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, ErrorMessage, Heading, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import ikon from '../../../assets/ukjent_person.svg'
import useTranslation from '../../../hooks/useTranslation'
import {
    Infocard,
    InfocardFooter,
    InfocardFooterLink,
    InfocardHeader,
    InformationBox,
    InformationElement,
} from '../../common/card/InfoCard'
import { IParent } from '~context/application/application'

interface Props {
    parent: IParent
    edit: () => void
    remove: () => void
    isValidated?: boolean
}

const ParentInfoCard = memo(({ parent, edit, remove, isValidated }: Props) => {
    const { t } = useTranslation('common')

    const foedselsnummer = parent.fnrDnr?.replace(/(\d{6})(.*)/, '$1 $2')

    return (
        <Infocard>
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
                {!isValidated && <ErrorMessage>{t('missingInformation', { ns: 'aboutParents' })}</ErrorMessage>}
            </InformationBox>

            <InfocardFooter>
                <VStack gap="4">
                    <InfocardFooterLink href={'#'} onClick={edit}>
                        <EditFilled />
                        <BodyShort>{t('editButton', { ns: 'btn' })}</BodyShort>
                    </InfocardFooterLink>
                    <InfocardFooterLink href={'#'} onClick={remove}>
                        <DeleteFilled />
                        <BodyShort>{t('removeButton', { ns: 'btn' })}</BodyShort>
                    </InfocardFooterLink>
                </VStack>
            </InfocardFooter>
        </Infocard>
    )
})

export default ParentInfoCard
