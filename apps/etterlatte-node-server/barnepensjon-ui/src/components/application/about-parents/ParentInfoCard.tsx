import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react'
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
import { IDeceasedParent, IParent } from '../../../context/application/application'

interface Props {
    parent: IParent
    edit: () => void
    remove: () => void
}

const ParentInfoCard = memo(({ parent, edit, remove }: Props) => {
    const { t } = useTranslation('common')

    const foedselsnummer = parent.fnrDnr?.replace(/(\d{6})(.*)/, '$1 $2')

    return (
        <Infocard>
            <InfocardHeader>
                <img alt="forelder" src={ikon} />
            </InfocardHeader>

            <InformationBox>
                <BodyShort size={'small'}>
                    {(parent as IDeceasedParent).dateOfDeath
                        ? t('deceasedParent', { ns: 'aboutParents' })
                        : t('survivingParent', { ns: 'aboutParents' })}
                </BodyShort>

                <Heading size={'small'} spacing>
                    {parent.firstName} {parent.lastName}
                </Heading>

                <InformationElement>
                    {/* TODO: Endre fnr / dnr tekst dynamisk ? */}
                    <BodyShort size={'small'}>{t('fnrDnr')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {foedselsnummer}
                    </BodyShort>

                    <BodyShort size={'small'}>{t('citizenship')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {parent.citizenship}
                    </BodyShort>
                </InformationElement>
            </InformationBox>

            <InfocardFooter>
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
            </InfocardFooter>
        </Infocard>
    )
})

export default ParentInfoCard
