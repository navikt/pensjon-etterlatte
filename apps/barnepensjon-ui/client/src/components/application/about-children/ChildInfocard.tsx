import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Heading, Tag } from '@navikt/ds-react'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ikon from '../../../assets/barn1.svg'
import useTranslation from '../../../hooks/useTranslation'
import {
    Infocard,
    InfocardFooter,
    InfocardFooterItem,
    InfocardHeader,
    InformationBox,
    InformationBoxContent,
    InformationElement,
} from '../../common/card/InfoCard'
import { IChild } from '../../../types/person'
import FormElement from '../../common/FormElement'

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
                <img alt="barn" className="barneikon" src={ikon} />
            </InfocardHeader>

            <InformationBox>
                <InformationBoxContent>
                    <Heading size={'small'}>
                        {child.firstName} {child.lastName}
                    </Heading>
                </InformationBoxContent>
                <InformationElement>
                    <BodyShort size={'small'}>{t('infoCard_fnr')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {foedselsnummer}
                    </BodyShort>
                    <BodyShort size={'small'}>{t('infoCard_citizenship')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {child.citizenship}
                    </BodyShort>

                    <BodyShort size={'small'}>{t('infoCard_residence')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {t('livesIn')}&nbsp;
                        {child.staysAbroad?.answer === JaNeiVetIkke.JA
                            ? child.staysAbroad?.country
                            : t('norway', { ns: 'common' })}
                    </BodyShort>

                    {child.childrensPension?.applies === JaNeiVetIkke.JA && (
                        <FormElement>
                            <Tag variant={'success'} className={'mute'}>
                                {t('childAppliedForPension')}
                            </Tag>
                        </FormElement>
                    )}
                </InformationElement>
            </InformationBox>

            <InfocardFooter>
                <BodyLong>
                    <InfocardFooterItem
                        href={'#'}
                        className={'infokort__footer-item'}
                        onClick={(e: any) => {
                            e.preventDefault()
                            setActiveChildIndex()
                        }}
                    >
                        <EditFilled className={'edit-svg'} />
                        <span>{t('changeButton')}</span>
                    </InfocardFooterItem>
                </BodyLong>
                <BodyLong>
                    <InfocardFooterItem href={'#'} className={'infokort__footer-item'} onClick={() => remove(index)}>
                        <DeleteFilled className={'edit-svg'} />
                        <span>{t('removeChildButton')}</span>
                    </InfocardFooterItem>
                </BodyLong>
            </InfocardFooter>
        </Infocard>
    )
})

export default ChildInfoCard
