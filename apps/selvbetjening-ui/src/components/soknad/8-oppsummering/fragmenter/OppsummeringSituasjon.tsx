import { ISituasjon } from "../../../../typer/ytelser";
import { useTranslation } from "react-i18next";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import { v4 as uuid } from "uuid";
import TekstGruppe from "./TekstGruppe";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import Lenke from "nav-frontend-lenker";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";

const OppsummeringSituasjon = ({ state }: { state: ISituasjon }) => {
    const { t, i18n } = useTranslation();
    const ot = new ObjectTreeReader(i18n)

    const tekster = ot.traverse<ISituasjon>(state)

    return (
        <Ekspanderbartpanel tittel={"Din situasjon"} className={"oppsummering"} apen={true}>
            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
            ))}

            <Lenke href={`/soknad/steg/${StegPath.DinSituasjon}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringSituasjon;
