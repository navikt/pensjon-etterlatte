import useSWR, { SWRResponse } from 'swr'
import { Alert, BodyShort, Box, Heading, HGrid, Label, Link, Skeleton, VStack } from '@navikt/ds-react'
import { IInnloggetBruker } from '../../types/person.ts'
import { useTranslation } from 'react-i18next'
import { ExternalLinkIcon } from '@navikt/aksel-icons'

export const InformasjonOmInnloggetBruker = () => {
    const { data, isLoading, error }: SWRResponse<IInnloggetBruker, boolean, boolean> = useSWR('/api/person/innlogget')

    const { t } = useTranslation()

    return (
        <div>
            <Heading size="large" spacing>
                Dine opplysninger
            </Heading>
            {isLoading ? (
                <Skeleton variant="rounded" width={400} height={400} />
            ) : !!data && !error ? (
                <VStack gap="4">
                    <HGrid gap="4" columns={{ xs: 1, sm: 2 }} align="start">
                        <div>
                            <Label>{t('name')}</Label>
                            <BodyShort>
                                {data.fornavn} {data.etternavn}
                            </BodyShort>
                        </div>
                        <div>
                            <Label>{t('maritalStatus')}</Label>
                            <BodyShort>{data.sivilstatus ?? '-'}</BodyShort>
                        </div>
                        <div>
                            <Label>{t('fnrDnr')}</Label>
                            <BodyShort>{data.foedselsnummer ?? '-'}</BodyShort>
                        </div>
                        <div>
                            <Label>{t('citizenship')}</Label>
                            <BodyShort>{data.statsborgerskap ?? '-'}</BodyShort>
                        </div>
                        <div>
                            <Label>{t('address')}</Label>
                            <BodyShort>
                                {data.adresse} {data.husnummer}
                                {data.husbokstav ?? ''}
                            </BodyShort>
                            <BodyShort>
                                {data.postnummer} {data.poststed}
                            </BodyShort>
                        </div>
                        <div>
                            <Label>{t('phoneNumber')}</Label>
                            <BodyShort>{data.telefonnummer}</BodyShort>
                        </div>
                    </HGrid>
                    <Box maxWidth="27rem">
                        <Alert variant="info">
                            <BodyShort>{t('incorrectInfoMustBeCorrected')}</BodyShort>
                            <Link href={t('incorrectInfoMustBeCorrectedHref')}>
                                {t('incorrectInfoMustBeCorrectedHrefText')} <ExternalLinkIcon aria-hidden />
                            </Link>
                        </Alert>
                    </Box>
                </VStack>
            ) : (
                <Alert variant="error">Fant ikke din informasjon</Alert>
            )}
        </div>
    )
}
