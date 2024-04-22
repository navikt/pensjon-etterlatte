import { memo } from 'react'
import { Heading, Tag } from '@navikt/ds-react'
import { AccordionItem } from '../AccordionItem'
import { useTranslation } from 'react-i18next'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import { IMerOmSituasjonenDin, JobbStatus } from '../../../../typer/situasjon'
import { StillingType } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import { Studieform } from '../../../../typer/utdanning'
import { Panel } from '../../../felles/Panel'

interface Props {
    merOmSituasjonenDin: IMerOmSituasjonenDin
    senderSoeknad: boolean
}

export const OppsummeringMerSituasjonenDin = memo(({ merOmSituasjonenDin, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.MerOmSituasjonenDin)}
            path={`/skjema/steg/${StegPath.MerOmSituasjonenDin}`}
            pathText={StegPath.MerOmSituasjonenDin}
            senderSoeknad={senderSoeknad}
        >
            <Panel>
                <Heading size={'small'}>{t('merOmSituasjonenDin.jobbStatus.tittel')}</Heading>

                <TekstGruppe
                    tittel={t('merOmSituasjonenDin.jobbStatus')}
                    innhold={merOmSituasjonenDin.jobbStatus?.map((item) => ` ${t(item)}`)}
                />

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.arbeidstaker) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.arbeidsforhold.tittel')}</Heading>
                        {merOmSituasjonenDin.arbeidsforhold?.map((arbeid, index) => (
                            <Panel key={index}>
                                <Tag variant={'neutral-moderate'}>{`${arbeid.arbeidsgiver}`}</Tag>
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsgiver')}
                                    innhold={arbeid.arbeidsgiver}
                                />
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold')}
                                    innhold={t(arbeid.ansettelsesforhold!!)}
                                />
                                {arbeid.ansettelsesforhold === StillingType.fast && (
                                    <TekstGruppe
                                        tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar.fast')}
                                        innhold={t(arbeid.arbeidsmengde!!.svar)}
                                    />
                                )}

                                {(arbeid.ansettelsesforhold === StillingType.midlertidig ||
                                    arbeid.ansettelsesforhold === StillingType.tilkallingsvikar) && (
                                    <>
                                        <TekstGruppe
                                            tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar')}
                                            innhold={arbeid.arbeidsmengde!!.svar}
                                        />
                                        <TekstGruppe
                                            tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.type')}
                                            innhold={t(arbeid.arbeidsmengde!!.type!!)}
                                        />
                                        <TekstGruppeJaNeiVetIkke
                                            tittel={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.svar')}
                                            innhold={arbeid.midlertidig?.svar}
                                        />
                                        {arbeid.midlertidig?.svar === IValg.JA && (
                                            <TekstGruppe
                                                tittel={t(
                                                    'merOmSituasjonenDin.arbeidsforhold.midlertidig.sluttdatoVelger'
                                                )}
                                                innhold={arbeid.midlertidig.sluttdatoVelger}
                                            />
                                        )}
                                    </>
                                )}

                                <TekstGruppeJaNeiVetIkke
                                    tittel={t(
                                        'merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.svar'
                                    )}
                                    innhold={arbeid.forventerEndretArbeidssituasjon?.svar}
                                />

                                {arbeid.forventerEndretArbeidssituasjon?.svar === IValg.JA && (
                                    <TekstGruppe
                                        tittel={t(
                                            'merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse'
                                        )}
                                        innhold={arbeid.forventerEndretArbeidssituasjon.beskrivelse}
                                    />
                                )}
                            </Panel>
                        ))}
                    </Panel>
                )}

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.selvstendig) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.selvstendig.tittel')}</Heading>
                        {merOmSituasjonenDin.selvstendig?.map((arbeid, index) => (
                            <Panel key={index}>
                                <Tag variant={'neutral-moderate'}>{`${arbeid.beskrivelse}`}</Tag>
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.selvstendig.hvaHeterNaeringen')}
                                    innhold={arbeid.beskrivelse}
                                />
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.selvstendig.orgnr')}
                                    innhold={arbeid.orgnr}
                                />

                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.selvstendig.arbeidsmengde.svar')}
                                    innhold={arbeid.arbeidsmengde!!.svar}
                                />
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.selvstendig.arbeidsmengde.type')}
                                    innhold={t(arbeid.arbeidsmengde!!.type!!)}
                                />

                                <TekstGruppeJaNeiVetIkke
                                    tittel={t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.svar')}
                                    innhold={arbeid.forventerEndretArbeidssituasjon?.svar}
                                />

                                {arbeid.forventerEndretArbeidssituasjon?.svar === IValg.JA && (
                                    <TekstGruppe
                                        tittel={t(
                                            'merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.beskrivelse'
                                        )}
                                        innhold={arbeid.forventerEndretArbeidssituasjon.beskrivelse}
                                    />
                                )}
                            </Panel>
                        ))}
                    </Panel>
                )}

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.etablerer) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.etablererVirksomhet.tittel')}</Heading>

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.etablererVirksomhet.hvaHeterVirksomheten')}
                            innhold={merOmSituasjonenDin.etablererVirksomhet?.hvaHeterVirksomheten}
                        />

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.etablererVirksomhet.orgnr')}
                            innhold={
                                !!merOmSituasjonenDin.etablererVirksomhet?.manglerOrgnr?.length
                                    ? merOmSituasjonenDin.etablererVirksomhet?.manglerOrgnr
                                    : merOmSituasjonenDin.etablererVirksomhet?.orgnr
                            }
                        />

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.svar')}
                            innhold={merOmSituasjonenDin.etablererVirksomhet?.forretningsplan?.svar}
                        />

                        {merOmSituasjonenDin.etablererVirksomhet?.forretningsplan?.svar === IValg.JA && (
                            <TekstGruppeJaNeiVetIkke
                                tittel={t(
                                    'merOmSituasjonenDin.etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar'
                                )}
                                innhold={merOmSituasjonenDin.etablererVirksomhet.forretningsplan.samarbeidMedNAV?.svar}
                            />
                        )}
                    </Panel>
                )}

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.tilbud) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.tilbudOmJobb.tittel')}</Heading>

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.tilbudOmJobb.arbeidssted')}
                            innhold={merOmSituasjonenDin.tilbudOmJobb?.arbeidssted}
                        />

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesdato')}
                            innhold={merOmSituasjonenDin.tilbudOmJobb?.ansettelsesdato}
                        />

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold')}
                            innhold={t(merOmSituasjonenDin.tilbudOmJobb!!.ansettelsesforhold!!)}
                        />

                        {merOmSituasjonenDin.tilbudOmJobb?.ansettelsesforhold === StillingType.fast && (
                            <TekstGruppe
                                tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar.fast')}
                                innhold={t(merOmSituasjonenDin.tilbudOmJobb?.arbeidsmengde!!.svar)}
                            />
                        )}

                        {(merOmSituasjonenDin.tilbudOmJobb?.ansettelsesforhold === StillingType.midlertidig ||
                            merOmSituasjonenDin.tilbudOmJobb?.ansettelsesforhold === StillingType.tilkallingsvikar) && (
                            <>
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar')}
                                    innhold={merOmSituasjonenDin.tilbudOmJobb?.arbeidsmengde!!.svar}
                                />
                                <TekstGruppe
                                    tittel={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.type')}
                                    innhold={t(merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde!!.type!!)}
                                />
                                <TekstGruppeJaNeiVetIkke
                                    tittel={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.svar')}
                                    innhold={merOmSituasjonenDin.tilbudOmJobb?.midlertidig?.svar}
                                />
                                {merOmSituasjonenDin.tilbudOmJobb?.midlertidig?.svar === IValg.JA && (
                                    <TekstGruppe
                                        tittel={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.sluttdatoVelger')}
                                        innhold={merOmSituasjonenDin.tilbudOmJobb?.midlertidig.sluttdatoVelger}
                                    />
                                )}
                            </>
                        )}

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('merOmSituasjonenDin.tilbudOmJobb.aktivitetsplan.svar')}
                            innhold={merOmSituasjonenDin.tilbudOmJobb?.aktivitetsplan.svar}
                        />
                    </Panel>
                )}

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.arbeidssoeker) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.arbeidssoeker.tittel')}</Heading>

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('merOmSituasjonenDin.arbeidssoeker.svar')}
                            innhold={merOmSituasjonenDin.arbeidssoeker?.svar}
                        />

                        {merOmSituasjonenDin.arbeidssoeker?.svar === IValg.JA && (
                            <TekstGruppeJaNeiVetIkke
                                tittel={t('merOmSituasjonenDin.arbeidssoeker.aktivitetsplan.svar')}
                                innhold={merOmSituasjonenDin.arbeidssoeker?.aktivitetsplan.svar}
                            />
                        )}
                    </Panel>
                )}

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.underUtdanning) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.tittel')}</Heading>

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studiested')}
                            innhold={merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.studiested}
                        />

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studie')}
                            innhold={merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.studie}
                        />

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieform')}
                            innhold={t(merOmSituasjonenDin.utdanning!!.naavaerendeUtdanning!!.studieform!!)}
                        />
                        {merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.studieform === Studieform.deltid && (
                            <TekstGruppe
                                tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent')}
                                innhold={merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.studieprosent}
                            />
                        )}

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.startDato')}
                            innhold={merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.startDato}
                        />

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.sluttDato')}
                            innhold={merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.sluttDato}
                        />

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.godkjentUtdanning')}
                            innhold={merOmSituasjonenDin.utdanning?.naavaerendeUtdanning?.godkjentUtdanning}
                        />

                        {!!merOmSituasjonenDin.utdanning?.soeknadOmSkolepenger?.length && (
                            <TekstGruppe
                                tittel={t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger')}
                                innhold={t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.bekreftelse')}
                            />
                        )}

                        {!!merOmSituasjonenDin.utdanning?.soeknadOmTilleggsstoenadUtdanning?.length && (
                            <TekstGruppe
                                tittel={t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning')}
                                innhold={t(
                                    'merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse'
                                )}
                            />
                        )}

                        <TekstGruppeJaNeiVetIkke
                            tittel={t('merOmSituasjonenDin.utdanning.aktivitetsplan.svar')}
                            innhold={merOmSituasjonenDin.utdanning?.aktivitetsplan.svar}
                        />
                    </Panel>
                )}

                {merOmSituasjonenDin.jobbStatus?.includes(JobbStatus.ingen) && (
                    <Panel>
                        <Heading size={'small'}>{t('merOmSituasjonenDin.annenSituasjon.tittel')}</Heading>

                        <TekstGruppe
                            tittel={t('merOmSituasjonenDin.annenSituasjon.beskrivelse')}
                            innhold={merOmSituasjonenDin.annenSituasjon?.beskrivelse?.map((item) => ` ${t(item)}`)}
                        />

                        {merOmSituasjonenDin.annenSituasjon?.annet?.beskrivelse && (
                            <TekstGruppe
                                tittel={t('merOmSituasjonenDin.annenSituasjon.annet.beskrivelse')}
                                innhold={merOmSituasjonenDin.annenSituasjon?.annet?.beskrivelse}
                            />
                        )}
                    </Panel>
                )}
            </Panel>

            <Panel>
                <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.tittelFullfoert')}</Heading>
                <TekstGruppe
                    tittel={t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning')}
                    innhold={merOmSituasjonenDin.utdanning?.hoyesteFullfoerteUtdanning?.map((item) => ` ${t(item)}`)}
                />
            </Panel>
        </AccordionItem>
    )
})
