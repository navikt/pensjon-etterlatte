import { FormSummary } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { useSoknadContext } from '~context/soknad/SoknadContext'
import { StegLabelKey, StegPath } from '~typer/steg'
import { BankkontoType } from '~typer/utbetaling'
import { fullAdresse } from '~utils/adresse'

export const FormSummaryItemOmDeg = () => {
    const { state: soeknad } = useSoknadContext()
    const { state: bruker } = useBrukerContext()
    const { t } = useTranslation()

    const bankkontotype = soeknad?.omDeg?.utbetalingsInformasjon?.bankkontoType

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level={'2'}>{t(StegLabelKey.OmDeg)}</FormSummary.Heading>
            </FormSummary.Header>
            <FormSummary.Answers>
                <FormSummary.Answer>
                    <FormSummary.Label>{t('felles.navn')}</FormSummary.Label>
                    <FormSummary.Value>
                        {bruker.fornavn} {bruker.etternavn}
                    </FormSummary.Value>
                </FormSummary.Answer>
                {bruker.foedselsnummer && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('felles.fnrDnr')}</FormSummary.Label>
                        <FormSummary.Value>{bruker.foedselsnummer}</FormSummary.Value>
                    </FormSummary.Answer>
                )}
                {bruker.statsborgerskap && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('felles.statsborgerskap')}</FormSummary.Label>
                        <FormSummary.Value>{bruker.statsborgerskap}</FormSummary.Value>
                    </FormSummary.Answer>
                )}

                {bruker.sivilstatus && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('felles.sivilstatus')}</FormSummary.Label>
                        <FormSummary.Value>{t(`pdl.sivilstatus.${bruker.sivilstatus}`)}</FormSummary.Value>
                    </FormSummary.Answer>
                )}
                {bruker.adresse && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('felles.adresse')}</FormSummary.Label>
                        <FormSummary.Value>{fullAdresse(bruker)}</FormSummary.Value>
                    </FormSummary.Answer>
                )}
                {(bruker.telefonnummer || soeknad.omDeg.kontaktinfo?.telefonnummer) && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('felles.telefonnummer')}</FormSummary.Label>
                        <FormSummary.Value>
                            {bruker.telefonnummer || soeknad.omDeg.kontaktinfo?.telefonnummer}
                        </FormSummary.Value>
                    </FormSummary.Answer>
                )}
                {soeknad.omDeg.alternativAdresse && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('omDeg.alternativAdresse')}</FormSummary.Label>
                        <FormSummary.Value>{soeknad.omDeg.alternativAdresse}</FormSummary.Value>
                    </FormSummary.Answer>
                )}
                {soeknad.omDeg.utbetalingsInformasjon && (
                    <FormSummary.Answer>
                        <FormSummary.Label>{t('omDeg.utbetalingsInformasjon.oppsummeringstittel')} </FormSummary.Label>
                        <FormSummary.Value>
                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {t('omDeg.utbetalingsInformasjon.bankkontoType')}
                                    </FormSummary.Label>
                                    <FormSummary.Value>
                                        {t(soeknad.omDeg.utbetalingsInformasjon.bankkontoType)}
                                    </FormSummary.Value>
                                </FormSummary.Answer>
                                {bankkontotype === BankkontoType.norsk && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            {t('omDeg.utbetalingsInformasjon.kontonummer')}
                                        </FormSummary.Label>
                                        <FormSummary.Value>
                                            {soeknad.omDeg.utbetalingsInformasjon.kontonummer}
                                        </FormSummary.Value>
                                    </FormSummary.Answer>
                                )}
                                {bankkontotype === BankkontoType.utenlandsk && (
                                    <>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {t('omDeg.utbetalingsInformasjon.utenlandskBankNavn')}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {soeknad.omDeg.utbetalingsInformasjon.utenlandskBankNavn}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {t('omDeg.utbetalingsInformasjon.utenlandskBankAdresse')}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {soeknad.omDeg.utbetalingsInformasjon.utenlandskBankAdresse}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {t('omDeg.utbetalingsInformasjon.iban')}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {soeknad.omDeg.utbetalingsInformasjon.iban}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {t('omDeg.utbetalingsInformasjon.swift')}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {soeknad.omDeg.utbetalingsInformasjon.swift}
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                    </>
                                )}
                            </FormSummary.Answers>
                        </FormSummary.Value>
                    </FormSummary.Answer>
                )}
            </FormSummary.Answers>
            <FormSummary.Footer>
                <FormSummary.EditLink to={`/skjema/steg/${StegPath.OmDeg}`} as={Link}>
                    {t(`endreSvarOppsummering.${StegPath.OmDeg}`)}
                </FormSummary.EditLink>
            </FormSummary.Footer>
        </FormSummary>
    )
}
