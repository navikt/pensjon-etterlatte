import { Alert, BodyShort, Label, HGrid, Link } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { isEmpty } from 'lodash'
import React, { memo } from 'react'
import { fullAdresse } from '../../../utils/adresse'
import { ExternalLink } from '@navikt/ds-icons'
import { erForGammel } from '../../../utils/alder'
import { SkjemaElement } from '../../felles/SkjemaElement'

const InnloggetBruker = memo(() => {
    const { t } = useTranslation()

    const { state } = useBrukerContext()

    if (isEmpty(state)) return null

    return (
        <>
            <HGrid columns={{ xs: 1, sm: 2 }}>
                <div>
                    <Label>{t('felles.navn')}</Label>
                    <BodyShort spacing>
                        {state.fornavn} {state.etternavn}
                    </BodyShort>
                </div>

                <div>
                    <Label>{t('felles.fnrDnr')}</Label>
                    <BodyShort spacing>{state.foedselsnummer}</BodyShort>
                </div>

                {state.adresse && !state.adressebeskyttelse && (
                    <div>
                        <Label>{t('felles.adresse')}</Label>
                        <BodyShort spacing>{fullAdresse(state)}</BodyShort>
                    </div>
                )}

                <div>
                    <Label>{t('felles.sivilstatus')}</Label>
                    <BodyShort spacing>{t(`pdl.sivilstatus.${state.sivilstatus}`)}</BodyShort>
                </div>

                <div>
                    <Label>{t('felles.statsborgerskap')}</Label>
                    <BodyShort spacing>{state.statsborgerskap}</BodyShort>
                </div>

                {state.telefonnummer && (
                    <div>
                        <Label as={'span'}>{t('felles.telefonnummer')}</Label>
                        <BodyShort spacing>{state.telefonnummer}</BodyShort>
                    </div>
                )}
            </HGrid>

            {!state.adressebeskyttelse && state.adresse && (
                <Alert variant={'info'}>
                    <BodyShort>{t('omDeg.advarsel')}</BodyShort>
                    <Link href={t('omDeg.advarsel.href')} target="_blank" rel="noreferrer">
                        {t('omDeg.advarsel.href.tekst')}
                        <ExternalLink />
                    </Link>
                </Alert>
            )}

            {erForGammel(state.alder!!) && (
                <SkjemaElement>
                    <Alert variant={'warning'}>
                        <BodyShort>{t('omDeg.over67')}</BodyShort>
                    </Alert>
                </SkjemaElement>
            )}
        </>
    )
})

export default InnloggetBruker
