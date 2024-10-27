import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, ErrorMessage, Heading, VStack } from '@navikt/ds-react'
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
                    <BodyLong>
                        <InfocardFooterLink href={'#'} onClick={edit}>
                            <EditFilled />
                            <span>{t('editButton', { ns: 'btn' })}</span>
                        </InfocardFooterLink>
                    </BodyLong>
                    <BodyLong>
                        <InfocardFooterLink href={'#'} onClick={remove}>
                            <DeleteFilled />
                            <span>{t('removeButton', { ns: 'btn' })}</span>
                        </InfocardFooterLink>
                    </BodyLong>
                </VStack>
            </InfocardFooter>
        </Infocard>
    )
})

export default ParentInfoCard
