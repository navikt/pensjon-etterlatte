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

const OppsummeringTidlArbeid = ({ state }: { state: ITidligereArbeidsforhold[] }) => {
    const { t } = useTranslation();

    return (
        <Ekspanderbartpanel tittel={"Om tidligere arbeidsforhold"} className={"oppsummering"} apen={true}>
            {state.map((arbeid) => (
                <>
                    <Ingress>{arbeid.beskrivelse}</Ingress>

                    <Panel>
                        <TekstGruppe
                            tittel={t("felles.fraDato")}
                            innhold={arbeid.fraDato}
                        />
                        <TekstGruppe
                            tittel={t("felles.tilDato")}
                            innhold={arbeid.tilDato}
                        />
                    </Panel>
                </>
            ))}

            <Lenke href={`/soknad/steg/${StegPath.TidlArbeidsforhold}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringTidlArbeid;
