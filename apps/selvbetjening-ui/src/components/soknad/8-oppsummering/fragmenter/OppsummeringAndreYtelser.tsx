import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { IAndreYtelser } from "../../../../typer/ytelser";
import React from "react";
import { useTranslation } from "react-i18next";
import TekstGruppe from "./TekstGruppe";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Lenke from "nav-frontend-lenker";
import IValg from "../../../../typer/IValg";

const OppsummeringSituasjon = ({ state }: { state: IAndreYtelser }) => {
    const { t } = useTranslation();

    return (
        <Ekspanderbartpanel tittel={"Andre ytelser"} className={"oppsummering"}  apen={true}>
            <TekstGruppe
                tittel={t("andreYtelser.mottarAndreYtelser")}
                innhold={state.mottarAndreYtelser}
            />

            <TekstGruppe
                tittel={t("andreYtelser.kravOmAnnenStonad")}
                innhold={state.kravOmAnnenStonad?.svar}
            />
            {state.kravOmAnnenStonad?.svar === IValg.JA && (
                <TekstGruppe
                    tittel={t("andreYtelser.beskrivelseAvAnnenStoenad")}
                    innhold={state.kravOmAnnenStonad?.beskrivelseAvStoenad}
                />
            )}

            <TekstGruppe
                tittel={t("andreYtelser.mottarPensjonUtland")}
                innhold={state.mottarPensjonUtland?.svar}
            />
            {state.mottarPensjonUtland?.svar === IValg.JA && (
                <>
                    <TekstGruppe
                        tittel={t("andreYtelser.hvaSlagsPensjon")}
                        innhold={state.mottarPensjonUtland?.hvaSlagsPensjon}
                    />
                    <TekstGruppe
                        tittel={t("andreYtelser.mottarFraLand")}
                        innhold={state.mottarPensjonUtland?.fraHvilketLand}
                    />
                    <TekstGruppe
                        tittel={t("andreYtelser.bruttobeloep")}
                        innhold={state.mottarPensjonUtland?.bruttobeloepPrAar}
                    />
                    <TekstGruppe
                        tittel={t("andreYtelser.landetsValuta")}
                        innhold={state.mottarPensjonUtland?.landetsValuta}
                    />
                </>
            )}

            <Lenke href={`/soknad/steg/${StegPath.AndreYtelser}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringSituasjon;
