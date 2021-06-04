import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { ISituasjon } from "../../../../typer/ytelser";
import React from "react";
import { useTranslation } from "react-i18next";
import TekstGruppe from "./TekstGruppe";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Lenke from "nav-frontend-lenker";


const OppsummeringSituasjon = ({ state }: { state: ISituasjon }) => {
    const { t } = useTranslation();

    const hovedytelse = state.valgteYtelser?.hovedytelse;

    return (
        <Ekspanderbartpanel tittel={"Din situasjon"} className={"oppsummering"}  apen={true}>
            <TekstGruppe tittel={"Valgt ytelse: "} innhold={t(`stoenadType.${hovedytelse}`)} />

            <TekstGruppe tittel={"Søker barnepensjon?"} innhold={state.valgteYtelser?.barnepensjon} />

            <TekstGruppe tittel={"Fra dato: "} innhold={state.fraDato} />

            <Lenke href={`/soknad/steg/${StegPath.DinSituasjon}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringSituasjon;
