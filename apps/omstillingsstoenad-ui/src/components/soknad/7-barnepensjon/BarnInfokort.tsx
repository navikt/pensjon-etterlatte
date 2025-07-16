import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, Box, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react'
import { format } from 'date-fns'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ikon from '../../../assets/ikoner/barn1.svg'
import { IBarn } from '../../../typer/person'
import { IValg } from '../../../typer/Spoersmaal'

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
        <Box background="bg-subtle" marginBlock="0 4" borderRadius="0 0 4 4">
            <Box
                borderRadius="4 4 0 0"
                height="128px"
                borderWidth="0 0 4 0"
                style={{
                    backgroundColor: '#4d3e55',
                    borderBottomColor: '#826ba1',
                }}
            >
                <HStack justify="center" align="end" height="100%">
                    <img alt="barn" src={ikon} />
                </HStack>
            </Box>

            <VStack padding="8" align="center">
                <Heading size={'small'}>
                    {barn.fornavn} {barn.etternavn}
                </Heading>
                <Box marginBlock="2">
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
                </Box>

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
            </VStack>
        </Box>
    )
})

export default BarnInfokort
