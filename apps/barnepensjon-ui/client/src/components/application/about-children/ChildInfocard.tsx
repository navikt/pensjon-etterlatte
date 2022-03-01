import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyLong, BodyShort, Detail, Heading, Link } from '@navikt/ds-react'
import { memo } from 'react'
import styled from 'styled-components'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ikon from '../../../assets/barn1.svg'
import useTranslation from '../../../hooks/useTranslation'
import { IChild } from '../../../types/person'

export const Infocard = styled.div`
    .typo-normal,
    .typo-element {
        margin: 0.3rem 0;
    }

    background-color: #e7e9e9;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
        max-width: 49%;
    }
`

export const InfocardHeader = styled.div`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    align-items: flex-end;

    img {
        margin: 0 auto;
    }

    opacity: 0.4;
`

const InfocardFooter = styled.div`
    margin-bottom: 1rem;
`

const InfocardFooterItem = styled(Link)`
    display: flex;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
`

export const InformationBox = styled.div`
    padding: 2rem 2rem;
    text-align: center;
`

const InformationBoxContent = styled.div`
    text-align: center;
`
const InformationElement = styled.div`
    margin: 10px 0 10px 0;
`

interface Props {
    child: IChild
    index: number
    remove: (index: number) => void
    setActiveChildIndex: () => void
    isChild: boolean
}

const ChildInfoCard = memo(({ child, index, remove, setActiveChildIndex, isChild }: Props) => {
    const { t } = useTranslation('aboutChildren')

    const foedselsnummer = child.fnr?.replace(/(\d{6})(.*)/, '$1 $2')

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

                    {!isChild && (
                        <>
                            <BodyShort size={'small'}>{t('infoCard.parents')}</BodyShort>
                            <BodyShort size={'small'} spacing>
                                {t(`${child.relation}`)}
                            </BodyShort>
                        </>
                    )}

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
