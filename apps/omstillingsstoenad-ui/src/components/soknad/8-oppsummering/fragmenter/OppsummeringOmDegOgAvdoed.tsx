import { Panel } from '@navikt/ds-react'
import { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { ForholdTilAvdoede, ISoekerOgAvdoed } from '../../../../typer/person'
import { useTranslation } from 'react-i18next'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import { IValg } from '../../../../typer/Spoersmaal'

interface Props {
    omDegOgAvdoed: ISoekerOgAvdoed
    senderSoeknad: boolean
}

export const OppsummeringOmDegOgAvdoed = memo(({ omDegOgAvdoed, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.OmDegOgAvdoed)}
            path={`/skjema/steg/${StegPath.OmDegOgAvdoed}`}
            pathText={StegPath.OmDegOgAvdoed}
            senderSoeknad={senderSoeknad}
        >
            <Panel>
                {omDegOgAvdoed.forholdTilAvdoede?.relasjon && (
                    <TekstGruppe
                        tittel={t('omDegOgAvdoed.forholdTilAvdoede.relasjon')}
                        innhold={t(omDegOgAvdoed.forholdTilAvdoede.relasjon)}
                    />
                )}

                {omDegOgAvdoed.forholdTilAvdoede?.relasjon === ForholdTilAvdoede.gift ||
                    (omDegOgAvdoed.forholdTilAvdoede?.relasjon === ForholdTilAvdoede.separert && (
                        <>
                            <TekstGruppe
                                tittel={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')}
                                innhold={omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap}
                            />
                            <TekstGruppeJaNeiVetIkke
                                tittel={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                                innhold={omDegOgAvdoed.forholdTilAvdoede.fellesBarn}
                            />
                        </>
                    ))}

                {omDegOgAvdoed.forholdTilAvdoede?.relasjon === ForholdTilAvdoede.samboer && (
                    <>
                        <TekstGruppe
                            tittel={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap')}
                            innhold={omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap}
                        />
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                            innhold={omDegOgAvdoed.forholdTilAvdoede.fellesBarn}
                        />
                        {omDegOgAvdoed.forholdTilAvdoede.fellesBarn === IValg.NEI && (
                            <TekstGruppeJaNeiVetIkke
                                tittel={t('omDegOgAvdoed.forholdTilAvdoede.tidligereGift')}
                                innhold={omDegOgAvdoed.forholdTilAvdoede.tidligereGift}
                            />
                        )}
                    </>
                )}

                {omDegOgAvdoed.forholdTilAvdoede?.relasjon === ForholdTilAvdoede.skilt && (
                    <>
                        <TekstGruppe
                            tittel={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')}
                            innhold={omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap}
                        />
                        <TekstGruppe
                            tittel={t('omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse')}
                            innhold={omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse}
                        />
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                            innhold={omDegOgAvdoed.forholdTilAvdoede.fellesBarn}
                        />

                        {omDegOgAvdoed.forholdTilAvdoede.fellesBarn === IValg.JA && (
                            <>
                                {omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn && (
                                    <TekstGruppeJaNeiVetIkke
                                        tittel={t('omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn')}
                                        innhold={omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn}
                                    />
                                )}
                            </>
                        )}

                        {omDegOgAvdoed.forholdTilAvdoede.mottokBidrag && (
                            <TekstGruppeJaNeiVetIkke
                                tittel={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.svar')}
                                innhold={omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.svar}
                            />
                        )}

                        {omDegOgAvdoed.forholdTilAvdoede.mottokBidrag?.svar === IValg.JA && (
                            <TekstGruppe
                                tittel={t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum')}
                                innhold={omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum}
                            />
                        )}
                    </>
                )}
            </Panel>
        </AccordionItem>
    )
})
