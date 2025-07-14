import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, Box, Button, Heading, Tag, VStack } from '@navikt/ds-react'
import { format } from 'date-fns'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import ikon from '../../../assets/ikoner/barn1.svg'
import { IBarn } from '../../../typer/person'
import { IValg } from '../../../typer/Spoersmaal'
import { Infokort, InfokortHeader, InfokortInformasjonsboks } from '../../felles/StyledComponents'

const InfokortInformasjonsElement = styled.div`
    margin: 10px 0 10px 0;
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
                            <BodyShort spacing>{foedselsnummer}</BodyShort>
                        </>
                    )}
                    {barn.foedselsdato && (
                        <>
                            <BodyShort>{t('omBarn.infokort.foedselsdato')}</BodyShort>
                            <BodyShort spacing>{format(barn.foedselsdato, 'dd.MM.yyyy')}</BodyShort>
                        </>
                    )}

                    <BodyShort>{t('omBarn.infokort.foreldre')}</BodyShort>
                    <BodyShort spacing>{t('omBarn.infokort.foreldre.jegOgAvdoed')}</BodyShort>

                    <BodyShort>{t('omBarn.infokort.statsborgerskap')}</BodyShort>
                    <BodyShort spacing>{barn.statsborgerskap}</BodyShort>

                    <BodyShort>{t('omBarn.infokort.bosted')}</BodyShort>
                    <BodyShort spacing>
                        {t('omBarn.borI')}&nbsp;
                        {barn.bosattUtland?.svar === IValg.JA ? barn.bosattUtland?.land : t('felles.norge')}
                    </BodyShort>

                    {barn.barnepensjon?.soeker ? (
                        <Box marginBlock="4">
                            <Tag variant={'success'}>{t('omBarn.barnepensjon.soekt')}</Tag>
                        </Box>
                    ) : (
                        <Box marginBlock="4">
                            <Tag variant={'warning'}>{t('omBarn.barnepensjon.ikkeSoekt')}</Tag>
                        </Box>
                    )}
                </InfokortInformasjonsElement>

                <VStack gap="2" align="center">
                    <Button
                        onClick={() => setAktivBarnIndex()}
                        icon={<EditFilled fontSize={20} aria-hidden />}
                        variant="tertiary"
                    >
                        {t('knapp.endre')}
                    </Button>
                    <Button
                        onClick={() => fjern(index)}
                        icon={<DeleteFilled fontSize={20} aria-hidden />}
                        variant="tertiary"
                    >
                        {t('knapp.fjernFraSoeknad')}
                    </Button>
                </VStack>
            </InfokortInformasjonsboks>
        </Infokort>
    )
})

export default BarnInfokort
