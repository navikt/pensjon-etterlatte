import { Heading } from '@navikt/ds-react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { erMellomOktoberogDesember } from '~utils/dato'
import { GrunnTilPaavirkelseAvInntekt, IInntekt, SkalGaaAvMedAlderspensjonValg } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { Panel } from '../../../felles/Panel'
import { AccordionItem } from '../AccordionItem'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'

interface Props {
    inntektenDin: IInntekt
    senderSoeknad: boolean
}

export const OppsummeringInntektenDin = memo(({ inntektenDin, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.InntektenDin)}
            path={`/skjema/steg/${StegPath.InntektenDin}`}
            pathText={StegPath.InntektenDin}
            senderSoeknad={senderSoeknad}
        >
            {inntektenDin.skalGaaAvMedAlderspensjon && (
                <Panel>
                    <Heading size={'small'}>
                        {erMellomOktoberogDesember()
                            ? t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektTilNesteAar')
                            : t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar')}
                    </Heading>

                    <TekstGruppe
                        tittel={
                            erMellomOktoberogDesember()
                                ? t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektTilNesteAar')
                                : t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar')
                        }
                        innhold={inntektenDin.skalGaaAvMedAlderspensjon?.valg}
                    />

                    {inntektenDin.skalGaaAvMedAlderspensjon?.valg === SkalGaaAvMedAlderspensjonValg.JA && (
                        <TekstGruppe
                            tittel={t('inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon')}
                            innhold={inntektenDin.skalGaaAvMedAlderspensjon?.datoForAaGaaAvMedAlderspensjon}
                        />
                    )}

                    {inntektenDin.skalGaaAvMedAlderspensjon?.valg ===
                        SkalGaaAvMedAlderspensjonValg.TAR_ALLEREDE_UT_ALDERSPENSJON && (
                        <TekstGruppe
                            tittel={t(
                                'inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon.tarAlleredeUtAlderspensjon'
                            )}
                            innhold={inntektenDin.skalGaaAvMedAlderspensjon?.datoForAaGaaAvMedAlderspensjon}
                        />
                    )}
                </Panel>
            )}

            {inntektenDin.inntektFremTilDoedsfallet && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.inntektFremTilDoedsfallet.tittel')}</Heading>

                    <TekstGruppe
                        tittel={t('inntektenDin.inntektFremTilDoedsfallet.arbeidsinntekt')}
                        innhold={inntektenDin.inntektFremTilDoedsfallet?.arbeidsinntekt}
                    />

                    <TekstGruppe
                        tittel={t('inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.inntekt')}
                        innhold={inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt}
                    />
                    {!!inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt &&
                        inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt !== '0' && (
                            <Panel>
                                <TekstGruppeJaNeiVetIkke
                                    tittel={t(
                                        'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                    )}
                                    innhold={
                                        inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt
                                            ?.erNaeringsinntektOpptjentJevnt?.valg
                                    }
                                />

                                {inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt
                                    ?.valg === IValg.NEI && (
                                    <TekstGruppe
                                        tittel={t(
                                            'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                        )}
                                        innhold={
                                            inntektenDin.inntektFremTilDoedsfallet?.naeringsinntekt
                                                ?.erNaeringsinntektOpptjentJevnt?.beskrivelse
                                        }
                                    />
                                )}
                            </Panel>
                        )}

                    {inntektenDin.inntektFremTilDoedsfallet?.afpInntekt && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.inntektFremTilDoedsfallet.afpInntekt.inntekt')}
                                innhold={inntektenDin.inntektFremTilDoedsfallet?.afpInntekt?.inntekt}
                            />
                            <Panel>
                                <TekstGruppe
                                    tittel={t('inntektenDin.inntektFremTilDoedsfallet.afpInntekt.tjenesteordning')}
                                    innhold={inntektenDin.inntektFremTilDoedsfallet?.afpInntekt?.tjenesteordning}
                                />
                            </Panel>
                        </>
                    )}

                    <TekstGruppe
                        tittel={t('inntektenDin.inntektFremTilDoedsfallet.inntektFraUtland')}
                        innhold={inntektenDin.inntektFremTilDoedsfallet?.inntektFraUtland}
                    />

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.valg')}
                        innhold={inntektenDin.inntektFremTilDoedsfallet?.andreInntekter?.valg}
                    />
                    {inntektenDin.inntektFremTilDoedsfallet?.andreInntekter?.valg === IValg.JA && (
                        <Panel>
                            <TekstGruppe
                                tittel={t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.inntekt')}
                                innhold={inntektenDin.inntektFremTilDoedsfallet?.andreInntekter?.inntekt}
                            />
                            <TekstGruppe
                                tittel={t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.beskrivelse')}
                                innhold={inntektenDin.inntektFremTilDoedsfallet?.andreInntekter?.beskrivelse}
                            />
                        </Panel>
                    )}
                </Panel>
            )}

            {inntektenDin.forventetInntektIAar && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.forventetInntektIAar.tittel')}</Heading>

                    <TekstGruppe
                        tittel={t('inntektenDin.forventetInntektIAar.arbeidsinntekt')}
                        innhold={inntektenDin.forventetInntektIAar?.arbeidsinntekt}
                    />

                    <TekstGruppe
                        tittel={t('inntektenDin.forventetInntektIAar.naeringsinntekt.inntekt')}
                        innhold={inntektenDin.forventetInntektIAar?.naeringsinntekt?.inntekt}
                    />
                    {!!inntektenDin.forventetInntektIAar?.naeringsinntekt?.inntekt &&
                        inntektenDin.forventetInntektIAar?.naeringsinntekt?.inntekt !== '0' && (
                            <Panel>
                                <TekstGruppeJaNeiVetIkke
                                    tittel={t(
                                        'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                    )}
                                    innhold={
                                        inntektenDin.forventetInntektIAar?.naeringsinntekt
                                            ?.erNaeringsinntektOpptjentJevnt?.valg
                                    }
                                />

                                {inntektenDin.forventetInntektIAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt
                                    ?.valg === IValg.NEI && (
                                    <TekstGruppe
                                        tittel={t(
                                            'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                        )}
                                        innhold={
                                            inntektenDin.forventetInntektIAar?.naeringsinntekt
                                                ?.erNaeringsinntektOpptjentJevnt?.beskrivelse
                                        }
                                    />
                                )}
                            </Panel>
                        )}

                    {inntektenDin.forventetInntektIAar?.afpInntekt && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.forventetInntektIAar.afpInntekt.inntekt')}
                                innhold={inntektenDin.forventetInntektIAar?.afpInntekt?.inntekt}
                            />
                            <Panel>
                                <TekstGruppe
                                    tittel={t('inntektenDin.forventetInntektIAar.afpInntekt.tjenesteordning')}
                                    innhold={inntektenDin.forventetInntektIAar?.afpInntekt?.tjenesteordning}
                                />
                            </Panel>
                        </>
                    )}

                    <TekstGruppe
                        tittel={t('inntektenDin.forventetInntektIAar.inntektFraUtland')}
                        innhold={inntektenDin.forventetInntektIAar?.inntektFraUtland}
                    />

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.forventetInntektIAar.andreInntekter.valg')}
                        innhold={inntektenDin.forventetInntektIAar?.andreInntekter?.valg}
                    />
                    {inntektenDin.forventetInntektIAar?.andreInntekter?.valg === IValg.JA && (
                        <Panel>
                            <TekstGruppe
                                tittel={t('inntektenDin.forventetInntektIAar.andreInntekter.inntekt')}
                                innhold={inntektenDin.forventetInntektIAar?.andreInntekter?.inntekt}
                            />
                            <TekstGruppe
                                tittel={t('inntektenDin.forventetInntektIAar.andreInntekter.beskrivelse')}
                                innhold={inntektenDin.forventetInntektIAar?.andreInntekter?.beskrivelse}
                            />
                        </Panel>
                    )}

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.valg')}
                        innhold={inntektenDin.forventetInntektIAar?.noeSomKanPaavirkeInntekten?.valg}
                    />
                    {inntektenDin.forventetInntektIAar?.noeSomKanPaavirkeInntekten?.valg === IValg.JA && (
                        <Panel>
                            <TekstGruppe
                                tittel={t(
                                    'inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                                )}
                                innhold={t(
                                    inntektenDin.forventetInntektIAar?.noeSomKanPaavirkeInntekten
                                        ?.grunnTilPaavirkelseAvInntekt
                                )}
                            />
                            {inntektenDin.forventetInntektIAar?.noeSomKanPaavirkeInntekten
                                ?.grunnTilPaavirkelseAvInntekt === GrunnTilPaavirkelseAvInntekt.annenGrunn && (
                                <TekstGruppe
                                    tittel={t(
                                        'inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.beskrivelse'
                                    )}
                                    innhold={inntektenDin.forventetInntektIAar?.noeSomKanPaavirkeInntekten?.beskrivelse}
                                />
                            )}
                        </Panel>
                    )}
                </Panel>
            )}

            {inntektenDin.forventetInntektTilNesteAar && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.forventetInntektTilNesteAar.tittel')}</Heading>

                    <TekstGruppe
                        tittel={t('inntektenDin.forventetInntektTilNesteAar.arbeidsinntekt')}
                        innhold={inntektenDin.forventetInntektTilNesteAar?.arbeidsinntekt}
                    />

                    <TekstGruppe
                        tittel={t('inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.inntekt')}
                        innhold={inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt?.inntekt}
                    />
                    {!!inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt?.inntekt &&
                        inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt?.inntekt !== '0' && (
                            <Panel>
                                <TekstGruppeJaNeiVetIkke
                                    tittel={t(
                                        'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                    )}
                                    innhold={
                                        inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt
                                            ?.erNaeringsinntektOpptjentJevnt?.valg
                                    }
                                />

                                {inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt
                                    ?.erNaeringsinntektOpptjentJevnt?.valg === IValg.NEI && (
                                    <TekstGruppe
                                        tittel={t(
                                            'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                        )}
                                        innhold={
                                            inntektenDin.forventetInntektTilNesteAar?.naeringsinntekt
                                                ?.erNaeringsinntektOpptjentJevnt?.beskrivelse
                                        }
                                    />
                                )}
                            </Panel>
                        )}

                    {inntektenDin.forventetInntektTilNesteAar?.afpInntekt && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.forventetInntektTilNesteAar.afpInntekt.inntekt')}
                                innhold={inntektenDin.forventetInntektTilNesteAar?.afpInntekt?.inntekt}
                            />
                            <Panel>
                                <TekstGruppe
                                    tittel={t('inntektenDin.forventetInntektTilNesteAar.afpInntekt.tjenesteordning')}
                                    innhold={inntektenDin.forventetInntektTilNesteAar?.afpInntekt?.tjenesteordning}
                                />
                            </Panel>
                        </>
                    )}

                    <TekstGruppe
                        tittel={t('inntektenDin.forventetInntektTilNesteAar.inntektFraUtland')}
                        innhold={inntektenDin.forventetInntektTilNesteAar?.inntektFraUtland}
                    />

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.valg')}
                        innhold={inntektenDin.forventetInntektTilNesteAar?.andreInntekter?.valg}
                    />
                    {inntektenDin.forventetInntektTilNesteAar?.andreInntekter?.valg === IValg.JA && (
                        <Panel>
                            <TekstGruppe
                                tittel={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.inntekt')}
                                innhold={inntektenDin.forventetInntektTilNesteAar?.andreInntekter?.inntekt}
                            />
                            <TekstGruppe
                                tittel={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.beskrivelse')}
                                innhold={inntektenDin.forventetInntektTilNesteAar?.andreInntekter?.beskrivelse}
                            />
                        </Panel>
                    )}

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg')}
                        innhold={inntektenDin.forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten?.valg}
                    />
                    {inntektenDin.forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten?.valg === IValg.JA && (
                        <Panel>
                            <TekstGruppe
                                tittel={t(
                                    'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                                )}
                                innhold={t(
                                    inntektenDin.forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten
                                        ?.grunnTilPaavirkelseAvInntekt
                                )}
                            />
                            {inntektenDin.forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten
                                ?.grunnTilPaavirkelseAvInntekt === GrunnTilPaavirkelseAvInntekt.annenGrunn && (
                                <TekstGruppe
                                    tittel={t(
                                        'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.beskrivelse'
                                    )}
                                    innhold={
                                        inntektenDin.forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten
                                            ?.beskrivelse
                                    }
                                />
                            )}
                        </Panel>
                    )}
                </Panel>
            )}

            <Panel>
                <Heading size={'small'}>{t('inntektenDin.ytelserNAV.tittel')}</Heading>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('inntektenDin.ytelserNAV.svar')}
                    innhold={inntektenDin.ytelserNAV?.svar}
                />
                {inntektenDin.ytelserNAV?.svar === IValg.JA && (
                    <TekstGruppe
                        tittel={t('inntektenDin.ytelserNAV.soekteYtelser')}
                        innhold={inntektenDin.ytelserNAV?.soekteYtelser?.map((item) => ` ${t(item)}`)}
                    />
                )}
            </Panel>
            <Panel>
                <Heading size={'small'}>{t('inntektenDin.ytelserAndre.tittel')}</Heading>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('inntektenDin.ytelserAndre.svar')}
                    innhold={inntektenDin.ytelserAndre?.svar}
                />
                {inntektenDin.ytelserNAV?.svar === IValg.JA && (
                    <>
                        <TekstGruppe
                            tittel={t('inntektenDin.ytelserAndre.soekteYtelser')}
                            innhold={inntektenDin.ytelserAndre?.soekteYtelser?.map((item) => ` ${t(item)}`)}
                        />
                        <TekstGruppe
                            tittel={t('inntektenDin.ytelserAndre.pensjonsordning')}
                            innhold={inntektenDin.ytelserAndre?.pensjonsordning}
                        />
                    </>
                )}
            </Panel>
        </AccordionItem>
    )
})
