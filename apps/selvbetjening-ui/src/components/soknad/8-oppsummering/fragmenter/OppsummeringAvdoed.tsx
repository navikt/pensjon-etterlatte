import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { IAvdoed } from "../../../../typer/person";
import TekstGruppe from "./TekstGruppe";
import { useTranslation } from "react-i18next";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Lenke from "nav-frontend-lenker";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";
import { v4 as uuid } from "uuid";

const OppsummeringAvdoed = ({ state }: { state: IAvdoed }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n)

    const tekster = otr.traverse<IAvdoed>(state, "omDenAvdoede")

    return (
        <Ekspanderbartpanel tittel={"Om avdøde"} className={"oppsummering"} apen={true}>
            {tekster.filter(({ val }) => !!val).map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val} />
            ))}

            <Lenke href={`/soknad/steg/${StegPath.OmAvdoed}`}>
                <EditFilled />
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringAvdoed;
