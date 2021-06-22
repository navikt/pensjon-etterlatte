import TekstGruppe from "./TekstGruppe";
import Lenke from "nav-frontend-lenker";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { useTranslation } from "react-i18next";
import { Ingress } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { ITidligereArbeidsforhold } from "../../../../typer/arbeidsforhold";
import { v4 as uuid } from "uuid";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";

const OppsummeringTidlArbeid = ({ state }: { state: ITidligereArbeidsforhold[] }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n);

    const arbeidsforhold = state.map(arbeid => {
        return {
            ingress: arbeid.beskrivelse,
            tekster: otr.traverse<ITidligereArbeidsforhold>(arbeid, "tidligereArbeidsforhold")
        }
    });

    return (
        <Ekspanderbartpanel tittel={"Om tidligere arbeidsforhold"} className={"oppsummering"} apen={true}>
            {arbeidsforhold.map(({ ingress, tekster }) => (
                <div key={uuid()}>
                    <Ingress>{ingress}</Ingress>

                    <Panel>
                        {tekster.map(({ key, val }) => (
                            <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
                        ))}
                    </Panel>
                </div>
            ))}

            <Lenke href={`/soknad/steg/${StegPath.TidlArbeidsforhold}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringTidlArbeid;
