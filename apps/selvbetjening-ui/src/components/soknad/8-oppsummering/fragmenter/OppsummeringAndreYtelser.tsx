import { memo } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { IAndreYtelser } from "../../../../typer/ytelser";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import TekstGruppe from "./TekstGruppe";
import Lenke from "nav-frontend-lenker";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";

const OppsummeringSituasjon = memo(({ state }: { state: IAndreYtelser }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n)

    const tekster = otr.traverse<IAndreYtelser>(state, "andreYtelser")

    return (
        <Ekspanderbartpanel tittel={"Andre ytelser"} className={"oppsummering"} apen={true}>
            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
            ))}

            <Lenke href={`/soknad/steg/${StegPath.AndreYtelser}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
});

export default OppsummeringSituasjon;
