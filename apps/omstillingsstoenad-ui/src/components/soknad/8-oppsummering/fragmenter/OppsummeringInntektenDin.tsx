import { Heading, Panel } from '@navikt/ds-react'
import React, { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { useTranslation } from 'react-i18next'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import {
    EndringAvInntektGrunn,
    IInntekt,
    InntektEllerUtbetaling,
    InntektsTyper,
    NorgeOgUtland,
    PensjonEllerTrygd,
} from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { doedsdatoErIAar } from '../../../../utils/dato'

interface Props {
    inntektenDin: IInntekt
    senderSoeknad: boolean
    datoforDoedsfallet: Date
}

export const OppsummeringInntektenDin = memo(({ inntektenDin, senderSoeknad, datoforDoedsfallet }: Props) => {
    const { t } = useTranslation()

    const doedsfallIAar = doedsdatoErIAar(datoforDoedsfallet!!)

    return (
        <AccordionItem
            tittel={t(StegLabelKey.InntektenDin)}
            path={`/skjema/steg/${StegPath.InntektenDin}`}
            pathText={StegPath.InntektenDin}
            senderSoeknad={senderSoeknad}
        >
            <Panel>
                <Heading size={'small'}>{t('inntektenDin.undertittel')}</Heading>
                <TekstGruppe
                    tittel={t('inntektenDin.inntektstyper')}
                    innhold={inntektenDin.inntektstyper?.map((item) => ` ${t(item)}`)}
                />
            </Panel>

            {inntektenDin.inntektstyper?.includes(InntektsTyper.loenn) && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.loennsinntekt.tittel')}</Heading>
                    <TekstGruppe
                        tittel={t('inntektenDin.loennsinntekt.norgeEllerUtland')}
                        innhold={inntektenDin.loennsinntekt?.norgeEllerUtland?.map((item) => ` ${t(item)}`)}
                    />

                    {inntektenDin.loennsinntekt?.norgeEllerUtland.includes(NorgeOgUtland.norge) && (
                        <Panel>
                            <Heading size={'xsmall'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.norge')}</Heading>

                            {inntektenDin.loennsinntekt.norge?.inntektIFjor?.tilDoedsfall && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.norge.inntektIFjor.tilDoedsfall')}
                                    innhold={inntektenDin.loennsinntekt.norge?.inntektIFjor.tilDoedsfall}
                                />
                            )}
                            {inntektenDin.loennsinntekt.norge?.inntektIFjor?.aarsinntekt && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt')}
                                    innhold={inntektenDin.loennsinntekt.norge?.inntektIFjor.aarsinntekt}
                                />
                            )}
                            {inntektenDin.loennsinntekt.norge?.inntektIAar?.tilDoedsfall && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.norge.inntektIAar.tilDoedsfall')}
                                    innhold={inntektenDin.loennsinntekt.norge?.inntektIAar?.tilDoedsfall}
                                />
                            )}
                            {inntektenDin.loennsinntekt.norge?.inntektIAar?.aarsinntekt && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                    innhold={inntektenDin.loennsinntekt.norge?.inntektIAar?.aarsinntekt}
                                />
                            )}
                            {inntektenDin.loennsinntekt.norge?.inntektNesteAar?.aarsinntekt && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.norge.inntektNesteAar.aarsinntekt')}
                                    innhold={inntektenDin.loennsinntekt.norge?.inntektNesteAar?.aarsinntekt}
                                />
                            )}
                        </Panel>
                    )}

                    {inntektenDin.loennsinntekt?.norgeEllerUtland.includes(NorgeOgUtland.utland) && (
                        <Panel>
                            <Heading size={'xsmall'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.utland')}</Heading>

                            {inntektenDin.loennsinntekt.utland?.inntektAaretFoerDoedsfall && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.inntektAaretFoerDoedsfall')}
                                    innhold={inntektenDin.loennsinntekt.utland?.inntektAaretFoerDoedsfall}
                                />
                            )}

                            {inntektenDin.loennsinntekt.utland?.inntektIFjor?.tilDoedsfall && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.utland.inntektIFjor.tilDoedsfall')}
                                    innhold={inntektenDin.loennsinntekt.utland?.inntektIFjor.tilDoedsfall}
                                />
                            )}

                            {inntektenDin.loennsinntekt.utland?.inntektIFjor?.aarsinntekt && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt')}
                                    innhold={inntektenDin.loennsinntekt.utland?.inntektIFjor.aarsinntekt}
                                />
                            )}

                            {inntektenDin.loennsinntekt.utland?.inntektIAar?.tilDoedsfall && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.utland.inntektIAar.tilDoedsfall')}
                                    innhold={inntektenDin.loennsinntekt.utland?.inntektIAar.tilDoedsfall}
                                />
                            )}

                            {inntektenDin.loennsinntekt.utland?.inntektIAar?.aarsinntekt && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                    innhold={inntektenDin.loennsinntekt.utland?.inntektIAar?.aarsinntekt}
                                />
                            )}

                            {inntektenDin.loennsinntekt.utland?.inntektNesteAar?.aarsinntekt && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.utland.inntektNesteAar.aarsinntekt')}
                                    innhold={inntektenDin.loennsinntekt.utland?.inntektNesteAar?.aarsinntekt}
                                />
                            )}
                        </Panel>
                    )}

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.loennsinntekt.forventerEndringAvInntekt.svar')}
                        innhold={inntektenDin.loennsinntekt?.forventerEndringAvInntekt?.svar}
                    />

                    {inntektenDin.loennsinntekt?.forventerEndringAvInntekt?.svar === IValg.JA && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.loennsinntekt.forventerEndringAvInntekt.grunn')}
                                innhold={t(inntektenDin.loennsinntekt!!.forventerEndringAvInntekt!!.grunn!!)}
                            />

                            {inntektenDin.loennsinntekt.forventerEndringAvInntekt.grunn ===
                                EndringAvInntektGrunn.annenGrunn && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.loennsinntekt.forventerEndringAvInntekt.annenGrunn')}
                                    innhold={inntektenDin.loennsinntekt.forventerEndringAvInntekt.annenGrunn}
                                />
                            )}
                        </>
                    )}
                </Panel>
            )}

            {inntektenDin.inntektstyper?.includes(InntektsTyper.naering) && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.tittel')}</Heading>
                    <TekstGruppe
                        tittel={t('inntektenDin.naeringsinntekt.norgeEllerUtland')}
                        innhold={inntektenDin.naeringsinntekt?.norgeEllerUtland?.map((item) => ` ${t(item)}`)}
                    />

                    {inntektenDin.naeringsinntekt?.norgeEllerUtland.includes(NorgeOgUtland.norge) && (
                        <Panel>
                            <Heading size={'xsmall'}>
                                {t('inntektenDin.naeringsinntekt.norgeEllerUtland.norge')}
                            </Heading>

                            <TekstGruppeJaNeiVetIkke
                                tittel={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.svar')}
                                innhold={inntektenDin.naeringsinntekt?.norge?.sesongbasertNaeringsinntekt?.svar}
                            />

                            {inntektenDin.naeringsinntekt?.norge?.sesongbasertNaeringsinntekt?.svar === IValg.JA && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.beskrivelse')}
                                    innhold={
                                        inntektenDin.naeringsinntekt?.norge?.sesongbasertNaeringsinntekt?.beskrivelse
                                    }
                                />
                            )}

                            {doedsfallIAar ? (
                                <TekstGruppe
                                    tittel={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt')}
                                    innhold={inntektenDin.naeringsinntekt.norge?.inntektIFjor?.aarsinntekt}
                                />
                            ) : (
                                <TekstGruppe
                                    tittel={t(
                                        'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer'
                                    )}
                                    innhold={inntektenDin.naeringsinntekt.norge?.inntektAaretFoerDoedsfall}
                                />
                            )}
                            <TekstGruppe
                                tittel={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                innhold={inntektenDin.naeringsinntekt.norge?.inntektIAar?.aarsinntekt}
                            />
                        </Panel>
                    )}

                    {inntektenDin.naeringsinntekt?.norgeEllerUtland.includes(NorgeOgUtland.utland) && (
                        <Panel>
                            <Heading size={'xsmall'}>
                                {t('inntektenDin.naeringsinntekt.norgeEllerUtland.utland')}
                            </Heading>

                            <TekstGruppeJaNeiVetIkke
                                tittel={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.svar')}
                                innhold={inntektenDin.naeringsinntekt?.utland?.sesongbasertNaeringsinntekt?.svar}
                            />

                            {inntektenDin.naeringsinntekt?.utland?.sesongbasertNaeringsinntekt?.svar === IValg.JA && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.beskrivelse')}
                                    innhold={
                                        inntektenDin.naeringsinntekt?.utland?.sesongbasertNaeringsinntekt?.beskrivelse
                                    }
                                />
                            )}

                            {doedsfallIAar ? (
                                <TekstGruppe
                                    tittel={t('inntektenDin.naeringsinntekt.utland.inntektIFjor.aarsinntekt')}
                                    innhold={inntektenDin.naeringsinntekt.utland?.inntektIFjor?.aarsinntekt}
                                />
                            ) : (
                                <TekstGruppe
                                    tittel={t(
                                        'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer'
                                    )}
                                    innhold={inntektenDin.naeringsinntekt.utland?.inntektAaretFoerDoedsfall}
                                />
                            )}

                            <TekstGruppe
                                tittel={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                innhold={inntektenDin.naeringsinntekt.utland?.inntektIAar?.aarsinntekt}
                            />
                        </Panel>
                    )}

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.naeringsinntekt.forventerEndringAvInntekt.svar')}
                        innhold={inntektenDin.naeringsinntekt?.forventerEndringAvInntekt?.svar}
                    />

                    {inntektenDin.naeringsinntekt?.forventerEndringAvInntekt?.svar === IValg.JA && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.naeringsinntekt.forventerEndringAvInntekt.grunn')}
                                innhold={t(inntektenDin.naeringsinntekt!!.forventerEndringAvInntekt!!.grunn!!)}
                            />

                            {inntektenDin.naeringsinntekt.forventerEndringAvInntekt.grunn ===
                                EndringAvInntektGrunn.annenGrunn && (
                                <TekstGruppe
                                    tittel={t('inntektenDin.naeringsinntekt.forventerEndringAvInntekt.annenGrunn')}
                                    innhold={inntektenDin.naeringsinntekt.forventerEndringAvInntekt.annenGrunn}
                                />
                            )}
                        </>
                    )}
                </Panel>
            )}

            {inntektenDin.inntektstyper?.includes(InntektsTyper.pensjonEllerUfoere) && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.pensjonEllerUfoere.tittel')}</Heading>
                    <TekstGruppe
                        tittel={t('inntektenDin.pensjonEllerUfoere.pensjonstype')}
                        innhold={inntektenDin.pensjonEllerUfoere?.pensjonstype?.map((item) => ` ${t(item)}`)}
                    />

                    {inntektenDin.pensjonEllerUfoere?.pensjonstype?.includes(
                        PensjonEllerTrygd.tjenestepensjonsordning
                    ) && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type')}
                                innhold={t(inntektenDin!!.pensjonEllerUfoere!!.tjenestepensjonsordning!!.type!!)}
                            />
                            <TekstGruppe
                                tittel={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler')}
                                innhold={inntektenDin!!.pensjonEllerUfoere!!.tjenestepensjonsordning!!.utbetaler!!}
                            />
                        </>
                    )}
                    <TekstGruppeJaNeiVetIkke
                        tittel={t('inntektenDin.pensjonEllerUfoere.utland.svar')}
                        innhold={inntektenDin.pensjonEllerUfoere?.utland.svar}
                    />

                    {inntektenDin.pensjonEllerUfoere?.utland.svar === IValg.JA && (
                        <>
                            <TekstGruppe
                                tittel={t('inntektenDin.pensjonEllerUfoere.utland.type')}
                                innhold={inntektenDin!!.pensjonEllerUfoere!!.utland.type}
                            />

                            <TekstGruppe
                                tittel={t('inntektenDin.pensjonEllerUfoere.utland.land')}
                                innhold={inntektenDin!!.pensjonEllerUfoere!!.utland.land}
                            />

                            <TekstGruppe
                                tittel={t('inntektenDin.pensjonEllerUfoere.utland.beloep')}
                                innhold={inntektenDin!!.pensjonEllerUfoere!!.utland.beloep}
                            />

                            <TekstGruppe
                                tittel={t('inntektenDin.pensjonEllerUfoere.utland.valuta')}
                                innhold={inntektenDin!!.pensjonEllerUfoere!!.utland.valuta}
                            />
                        </>
                    )}
                </Panel>
            )}

            {inntektenDin.inntektstyper?.includes(InntektsTyper.annen) && (
                <Panel>
                    <Heading size={'small'}>{t('inntektenDin.annenInntekt.tittel')}</Heading>
                    <TekstGruppe
                        tittel={t('inntektenDin.annenInntekt.inntektEllerUtbetaling')}
                        innhold={inntektenDin.annenInntekt?.inntektEllerUtbetaling?.map((item) => ` ${t(item)}`)}
                    />
                    {inntektenDin.annenInntekt?.inntektEllerUtbetaling.includes(InntektEllerUtbetaling.annen) && (
                        <TekstGruppe
                            tittel={t('inntektenDin.annenInntekt.beloep')}
                            innhold={inntektenDin.annenInntekt?.beloep}
                        />
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
