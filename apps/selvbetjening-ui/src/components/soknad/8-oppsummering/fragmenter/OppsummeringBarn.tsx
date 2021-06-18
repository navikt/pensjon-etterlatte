import TekstGruppe from "./TekstGruppe";
import Lenke from "nav-frontend-lenker";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { IBarn } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { Ingress } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { v4 as uuid } from "uuid";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";

const OppsummeringBarn = ({ state }: { state: IBarn[] }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n)

    const barnMedTekster = state.map(barn => {
        return {
            ingress: `${barn.fornavn} ${barn.etternavn}`,
            tekster: otr.traverse<IBarn>(barn, "barn")
        }
    })

    return (
        <Ekspanderbartpanel tittel={"Om barn"} className={"oppsummering"} apen={true}>
            {barnMedTekster.map(barn => (
                <div key={uuid()}>
                    <Ingress>{barn.ingress}</Ingress>
                    <Panel>
                        {barn.tekster.map(({ key, val }) => (
                            <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
                        ))}
                    </Panel>
                </div>
            ))}

            <Lenke href={`/soknad/steg/${StegPath.OmBarn}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringBarn;
