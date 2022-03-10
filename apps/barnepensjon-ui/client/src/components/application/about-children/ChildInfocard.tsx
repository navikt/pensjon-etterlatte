import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Detail, Heading } from '@navikt/ds-react'
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

interface Props {
    child: IChild
    index: number
    remove: (index: number) => void
    setActiveChildIndex: () => void
    isChild: boolean
}

const ChildInfoCard = memo(({ child, index, remove, setActiveChildIndex, isChild }: Props) => {
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
                    <BodyShort size={'small'}>{t('infoCard.fnr')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {foedselsnummer}
                    </BodyShort>

                    {/*{!isChild && (*/}
                    {/*    <>*/}
                    {/*        <BodyShort size={'small'}>{t('infoCard.parents')}</BodyShort>*/}
                    {/*        <BodyShort size={'small'} spacing>*/}
                    {/*            {t(`${child.bothParents}`)}*/}
                    {/*        </BodyShort>*/}
                    {/*    </>*/}
                    {/*)}*/}

                    <BodyShort size={'small'}>{t('infoCard.citizenship')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {child.citizenship}
                    </BodyShort>

                    <BodyShort size={'small'}>{t('infoCard.residence')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {t('livesIn')}&nbsp;
                        {child.staysAbroad?.answer === JaNeiVetIkke.JA
                            ? child.staysAbroad?.country
                            : t('common.norway')}
                    </BodyShort>

                    <Detail size={'small'} spacing className={'mute'}>
                        {child.childrensPension?.applies === JaNeiVetIkke.JA && t('childrensPension.applied')}
                    </Detail>
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
                        <span>{t('btn.change')}</span>
                    </InfocardFooterItem>
                </BodyLong>
                <BodyLong>
                    <InfocardFooterItem href={'#'} className={'infokort__footer-item'} onClick={() => remove(index)}>
                        <DeleteFilled className={'edit-svg'} />
                        <span>{t('btn.removeFromApplication')}</span>
                    </InfocardFooterItem>
                </BodyLong>
            </InfocardFooter>
        </Infocard>
    )
})

export default ChildInfoCard
