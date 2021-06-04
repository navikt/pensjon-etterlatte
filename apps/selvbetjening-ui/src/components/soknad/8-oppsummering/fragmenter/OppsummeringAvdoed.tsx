import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { IAvdoed } from "../../../../typer/person";
import TekstGruppe from "./TekstGruppe";
import { useTranslation } from "react-i18next";
import IValg from "../../../../typer/IValg";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Lenke from "nav-frontend-lenker";

const OppsummeringAvdoed = ({ state }: { state: IAvdoed }) => {
    const { t } = useTranslation();

    return (
        <Ekspanderbartpanel tittel={"Om avdøde"} className={"oppsummering"} apen={true}>
            <TekstGruppe tittel={t("felles.fornavn")} innhold={state.fornavn}/>
            <TekstGruppe tittel={t("felles.etternavn")} innhold={state.etternavn}/>
            <TekstGruppe tittel={t("felles.fnr")} innhold={state.foedselsnummer}/>
            <TekstGruppe tittel={t("felles.doedsdato")} innhold={state.doedsdato}/>
            <TekstGruppe tittel={t("felles.statsborgerskap")} innhold={state.statsborgerskap}/>

            <TekstGruppe tittel={t("omDenAvdoede.bosattSammenhengende")} innhold={state.bosetning}/>
            <TekstGruppe tittel={t("omDenAvdoede.doedsfallPgaYrkesskade")} innhold={state.doedsfallAarsak}/>
            <TekstGruppe tittel={t("omDenAvdoede.boddEllerJobbetUtland")} innhold={state.boddEllerJobbetUtland}/>

            <TekstGruppe tittel={t("omDenAvdoede.haddePensjonsgivendeInntekt")}
                         innhold={state.haddePensjonsgivendeInntekt}/>

            {state.haddePensjonsgivendeInntekt === IValg.JA && (
                <TekstGruppe tittel={t("omDenAvdoede.pensjonsgivendeInntekt")}
                             innhold={state.pensjonsgivendeInntektSvar}/>
            )}

            <TekstGruppe tittel={t("omDenAvdoede.mottokPensjonAndreLand")}
                         innhold={state.haddePensjonAndreLand}/>

            {state.haddePensjonAndreLand === IValg.JA && (
                <TekstGruppe tittel={t("omDenAvdoede.pensjonUtlandBruttoinntekt")}
                             innhold={state.pensjonAndreLandSvar}/>
            )}

            <TekstGruppe tittel={t("omDenAvdoede.harAvtjentMilitaerTjeneste")}
                         innhold={state.harAvtjentMilitaerTjeneste}/>

            {state.harAvtjentMilitaerTjeneste === IValg.JA && (
                <TekstGruppe tittel={t("omDenAvdoede.avtjentMilitaerTjenesteAarstall")}
                             innhold={state.avtjentMilitaerTjenesteSvar}/>
            )}

            <Lenke href={`/soknad/steg/${StegPath.OmAvdoed}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringAvdoed;
