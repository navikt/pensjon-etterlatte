import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Heading, Tag } from '@navikt/ds-react'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ikon from '../../../assets/barn1.svg'
import useTranslation from '../../../hooks/useTranslation'
import {
    Infocard,
    InfocardFooter,
    InfocardFooterLink,
    InfocardHeader,
    InformationBox,
    InformationBoxContent,
    InformationElement,
} from '../../common/card/InfoCard'
import { IChild } from '../../../types/person'
import FormElement from '../../common/FormElement'
import { format } from 'date-fns'

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
        <Infocard>
            <InfocardHeader>
                <img alt="barn" src={ikon} />
            </InfocardHeader>

            <InformationBox>
                <InformationBoxContent>
                    <Heading size={'small'}>
                        {child.firstName} {child.lastName}
                    </Heading>
                </InformationBoxContent>
                <InformationElement>
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
                        <FormElement>
                            <Tag variant={'success'}>{t('childAppliedForPension')}</Tag>
                        </FormElement>
                    ) : (
                        <FormElement>
                            <Tag variant={'warning'}>{t('childNotApplyingForPension')}</Tag>
                        </FormElement>
                    )}
                </InformationElement>
            </InformationBox>

            <InfocardFooter>
                <BodyLong>
                    <InfocardFooterLink
                        href={'#'}
                        onClick={(e: any) => {
                            e.preventDefault()
                            setActiveChildIndex()
                        }}
                    >
                        <EditFilled />
                        <span>{t('editButton', { ns: 'btn' })}</span>
                    </InfocardFooterLink>
                </BodyLong>
                <BodyLong>
                    <InfocardFooterLink href={'#'} onClick={() => remove(index)}>
                        <DeleteFilled />
                        <span>{t('removeChildButton')}</span>
                    </InfocardFooterLink>
                </BodyLong>
            </InfocardFooter>
        </Infocard>
    )
})

export default ChildInfoCard
