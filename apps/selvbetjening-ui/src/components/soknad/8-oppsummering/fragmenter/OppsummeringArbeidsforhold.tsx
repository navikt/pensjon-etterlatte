import { memo } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { EditFilled } from "@navikt/ds-icons";
import { StegPath } from "../../../../context/steg/steg";
import { IArbeidsforhold } from "../../../../typer/arbeidsforhold";
import Lenke from "nav-frontend-lenker";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";
import TekstGruppe from "./TekstGruppe";

const OppsummeringArbeidsforhold = memo(({ state }: { state: IArbeidsforhold }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n);

    const tekster = otr.traverse<IArbeidsforhold>(state, "naavaerendeArbeidsforhold");

    return (
        <Ekspanderbartpanel tittel={"Om nåværende arbeidsforhold"} className={"oppsummering"} apen={true}>
            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
            ))}

            <Lenke href={`/soknad/steg/${StegPath.Arbeidsforhold}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
});

export default OppsummeringArbeidsforhold;
