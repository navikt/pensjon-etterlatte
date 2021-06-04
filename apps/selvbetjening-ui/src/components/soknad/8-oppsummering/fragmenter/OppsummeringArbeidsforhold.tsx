import TekstGruppe from "./TekstGruppe";
import Lenke from "nav-frontend-lenker";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { useTranslation } from "react-i18next";
import { IArbeidsforhold } from "../../../../typer/arbeidsforhold";

const OppsummeringArbeidsforhold = ({ state }: { state: IArbeidsforhold }) => {
    const { t } = useTranslation();

    return (
        <Ekspanderbartpanel tittel={"Om nåværende arbeidsforhold"} className={"oppsummering"} apen={true}>
            <TekstGruppe
                tittel={t("felles.yrke")}
                innhold={state.yrke}
            />
            <TekstGruppe
                tittel={t("felles.stilling")}
                innhold={state.stilling}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.typeArbeidsforhold")}
                innhold={state.ansettelsesforhold}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.heltidEllerDeltid")}
                innhold={state.heltidDeltid}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.stillingsprosent")}
                innhold={state.stillingsprosent}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.arbeidsgiversNavn")}
                innhold={state.arbeidsgiver?.navn}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.arbeidsgiversAdresse")}
                innhold={state.arbeidsgiver?.adresse}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.bruttoInntektPrMd")}
                innhold={state.inntekt?.bruttoArbeidsinntektPrMd}
            />
            <TekstGruppe
                tittel={t("naavaerendeArbeidsforhold.personinntektFraNaering")}
                innhold={state.inntekt?.personinntektFraNaeringPrAr}
            />

            <Lenke href={`/soknad/steg/${StegPath.Arbeidsforhold}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringArbeidsforhold;
