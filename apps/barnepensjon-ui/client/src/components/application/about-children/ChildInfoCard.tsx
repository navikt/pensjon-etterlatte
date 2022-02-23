import { IChild } from '../../../types/person'
import ikon from '../../../assets/barn1.svg'
import { memo } from 'react'
import useTranslation from '../../../hooks/useTranslation'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { BodyShort, Detail, Link, Heading, BodyLong } from '@navikt/ds-react'
import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import styled from 'styled-components'

const Infocard = styled.div`
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

const InfocardHeader = styled.div`
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

const InformationBox = styled.div`
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
}

const ChildInfoCard = memo(({ child, index, remove, setActiveChildIndex }: Props) => {
    const { t } = useTranslation('omBarn')

    const foedselsnummer = child.foedselsnummer?.replace(/(\d{6})(.*)/, '$1 $2')

    return (
        <Infocard>
            <InfocardHeader>
                <img alt="barn" className="barneikon" src={ikon} />
            </InfocardHeader>

            <InformationBox>
                <InformationBoxContent>
                    <Heading size={'small'}>
                        {child.fornavn} {child.etternavn}
                    </Heading>
                </InformationBoxContent>
                <InformationElement>
                    <BodyShort size={'small'}>{t('infokort.foedselsnummer')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {foedselsnummer}
                    </BodyShort>

                    <BodyShort size={'small'}>{t('infokort.foreldre')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {t(`${child.relasjon}`)}
                    </BodyShort>

                    <BodyShort size={'small'}>{t('infokort.statsborgerskap')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {child.statsborgerskap}
                    </BodyShort>

                    <BodyShort size={'small'}>{t('infokort.bosted')}</BodyShort>
                    <BodyShort size={'small'} spacing>
                        {t('borI')}&nbsp;
                        {child.bosattUtland?.svar === JaNeiVetIkke.JA ? child.bosattUtland?.land : t('felles.norge')}
                    </BodyShort>

                    <Detail size={'small'} spacing className={'mute'}>
                        {child.barnepensjon?.soeker === JaNeiVetIkke.JA && t('barnepensjon.soekt')}
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
                        <span>{t('knapp.endre')}</span>
                    </InfocardFooterItem>
                </BodyLong>
                <BodyLong>
                    <InfocardFooterItem href={'#'} className={'infokort__footer-item'} onClick={() => remove(index)}>
                        <DeleteFilled className={'edit-svg'} />
                        <span>{t('knapp.fjernFraSoeknad')}</span>
                    </InfocardFooterItem>
                </BodyLong>
            </InfocardFooter>
        </Infocard>
    )
})

export default ChildInfoCard
