import TekstGruppe from "./TekstGruppe";
import Lenke from "nav-frontend-lenker";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { useTranslation } from "react-i18next";
import { IArbeidsforhold } from "../../../../typer/arbeidsforhold";
import { v4 as uuid } from "uuid";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";

const OppsummeringArbeidsforhold = ({ state }: { state: IArbeidsforhold }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n);

    const tekster = otr.traverse<IArbeidsforhold>(state, "arbeidsforhold");

    return (
        <Ekspanderbartpanel tittel={"Om nåværende arbeidsforhold"} className={"oppsummering"} apen={true}>
            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
            ))};

            <Lenke href={`/soknad/steg/${StegPath.Arbeidsforhold}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringArbeidsforhold;
