import { memo } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { EditFilled } from "@navikt/ds-icons";
import { StegPath } from "../../../../context/steg/steg";
import { Ingress } from "nav-frontend-typografi";
import { IBarn } from "../../../../typer/person";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import TekstGruppe from "./TekstGruppe";
import Lenke from "nav-frontend-lenker";
import Panel from "nav-frontend-paneler";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";

const OppsummeringBarn = memo(({ state }: { state: IBarn[] }) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n)

    const barnMedTekster = state.map(barn => {
        return {
            ingress: `${barn.fornavn} ${barn.etternavn}`,
            tekster: otr.traverse<IBarn>(barn, "omBarn")
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
})
export default OppsummeringBarn;
