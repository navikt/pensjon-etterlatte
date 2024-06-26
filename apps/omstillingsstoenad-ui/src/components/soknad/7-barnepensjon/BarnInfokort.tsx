import { IBarn } from '../../../typer/person'
import ikon from '../../../assets/ikoner/barn1.svg'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { IValg } from '../../../typer/Spoersmaal'
import { BodyShort, Heading, BodyLong, Link, Tag } from '@navikt/ds-react'
import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { Infokort, InfokortHeader, InfokortInformasjonsboks } from '../../felles/StyledComponents'
import styled from 'styled-components'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { format } from 'date-fns'

const InfokortInformasjonsElement = styled.div`
    margin: 10px 0 10px 0;
`

const InfokortFooter = styled.div`
    margin-bottom: 1rem;
`

const InfokortFooterItem = styled(Link)`
    display: flex;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
`

interface Props {
    barn: IBarn
    index: number
    fjern: (index: number) => void
    setAktivBarnIndex: () => void
}

const BarnInfokort = memo(({ barn, index, fjern, setAktivBarnIndex }: Props) => {
    const { t } = useTranslation()

    const foedselsnummer = barn.foedselsnummer?.replace(/(\d{6})(.*)/, '$1 $2')

    return (
        <Infokort>
            <InfokortHeader>
                <img alt="barn" src={ikon} />
            </InfokortHeader>

            <InfokortInformasjonsboks className={'center'}>
                <div className={'center'}>
                    <Heading size={'small'}>
                        {barn.fornavn} {barn.etternavn}
                    </Heading>
                </div>
                <InfokortInformasjonsElement>
                    {foedselsnummer && (
                        <>
                            <BodyShort>{t('omBarn.infokort.foedselsnummer')}</BodyShort>
                            <BodyShort spacing>
                                {foedselsnummer}
                            </BodyShort>
                        </>
                    )}
                    {barn.foedselsdato && (
                        <>
                            <BodyShort>{t('omBarn.infokort.foedselsdato')}</BodyShort>
                            <BodyShort spacing>
                                {format(barn.foedselsdato, 'dd.MM.yyyy')}
                            </BodyShort>
                        </>
                    )}

                    <BodyShort>{t('omBarn.infokort.foreldre')}</BodyShort>
                    <BodyShort spacing>
                        {t('omBarn.infokort.foreldre.jegOgAvdoed')}
                    </BodyShort>

                    <BodyShort>{t('omBarn.infokort.statsborgerskap')}</BodyShort>
                    <BodyShort spacing>
                        {barn.statsborgerskap}
                    </BodyShort>

                    <BodyShort>{t('omBarn.infokort.bosted')}</BodyShort>
                    <BodyShort spacing>
                        {t('omBarn.borI')}&nbsp;
                        {barn.bosattUtland?.svar === IValg.JA ? barn.bosattUtland?.land : t('felles.norge')}
                    </BodyShort>

                    {barn.barnepensjon?.soeker && (
                        <SkjemaElement>
                            <Tag variant={'success'}>{t('omBarn.barnepensjon.soekt')}</Tag>
                        </SkjemaElement>
                    )}
                </InfokortInformasjonsElement>
            </InfokortInformasjonsboks>

            <InfokortFooter>
                <BodyLong>
                    <InfokortFooterItem
                        href={'#'}
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault()
                            setAktivBarnIndex()
                        }}
                    >
                        <EditFilled className={'edit-svg'} />
                        <span>{t('knapp.endre')}</span>
                    </InfokortFooterItem>
                </BodyLong>
                <BodyLong>
                    <InfokortFooterItem href={'#'} onClick={() => fjern(index)}>
                        <DeleteFilled className={'edit-svg'} />
                        <span>{t('knapp.fjernFraSoeknad')}</span>
                    </InfokortFooterItem>
                </BodyLong>
            </InfokortFooter>
        </Infokort>
    )
})

export default BarnInfokort
