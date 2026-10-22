import { ExternalLinkIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, HGrid, InfoCard, Label, Link, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { IBruker } from '../../context/bruker/bruker'

const hentAdresse = (bruker: IBruker) => {
    if (!bruker.adresse || bruker.adressebeskyttelse) return undefined

    const gateadresse = `${bruker.adresse}${bruker.husnummer ? ` ${bruker.husnummer}` : ''}${bruker.husbokstav ?? ''}`
    const poststed = [bruker.postnummer, bruker.poststed].filter(Boolean).join(' ')

    return [gateadresse, poststed].filter(Boolean).join(', ')
}

const Personopplysninger = () => {
    const { t } = useTranslation()
    const { state } = useBrukerContext()
    const sivilstatus = state.sivilstatus
        ? t(`personopplysninger.sivilstatus.${state.sivilstatus}`, { defaultValue: state.sivilstatus })
        : undefined

    const opplysninger = [
        { label: t('personopplysninger.navn'), value: [state.fornavn, state.etternavn].filter(Boolean).join(' ') },
        { label: t('personopplysninger.foedselsnummer'), value: state.foedselsnummer },
        { label: t('personopplysninger.bostedsadresse'), value: hentAdresse(state) },
        { label: t('personopplysninger.sivilstatus'), value: sivilstatus },
        { label: t('personopplysninger.statsborgerskap'), value: state.statsborgerskap },
        { label: t('personopplysninger.telefonnummer'), value: state.telefonnummer },
    ]

    return (
        <VStack gap="space-48">
            <HGrid columns={{ xs: 1, sm: 2 }} gap="space-16">
                {opplysninger
                    .filter(({ value }) => Boolean(value))
                    .map(({ label, value }) => (
                        <VStack key={label} gap="space-4">
                            <Label as="span">{label}</Label>
                            <BodyShort>{value}</BodyShort>
                        </VStack>
                    ))}
            </HGrid>

            <InfoCard data-color="info" as="section" aria-labelledby="personopplysninger-info-title">
                <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                    <InfoCard.Title as="h3" id="personopplysninger-info-title">
                        {t('personopplysninger.opplysningerFeil.tittel')}
                    </InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                    <VStack gap="space-24">
                        <BodyLong>{t('personopplysninger.opplysningerFeil.innhold')}</BodyLong>
                        <Link href={t('personopplysninger.opplysningerFeil.href')} target="_blank" rel="noreferrer">
                            {t('personopplysninger.opplysningerFeil.lenke')}
                            <ExternalLinkIcon aria-hidden />
                        </Link>
                    </VStack>
                </InfoCard.Content>
            </InfoCard>
        </VStack>
    )
}

export default Personopplysninger
