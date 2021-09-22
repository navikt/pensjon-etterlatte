import { Element, Gruppe } from "../../../utils/ObjectTreeReader";
import { Accordion, BodyLong, Panel, Title } from "@navikt/ds-react";
import { v4 as uuid } from "uuid";
import TekstGruppe from "./fragmenter/TekstGruppe";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { EditFilled } from "@navikt/ds-icons";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const OppsummeringInnhold = memo(({ soeknadOppsummering, senderSoeknad }: {
    soeknadOppsummering: Gruppe[];
    senderSoeknad: boolean;
}) => {
    const { t } = useTranslation();

    const elementPanel = ({ tittel, innhold }: Element) => (
        <Panel key={uuid()}>
            {tittel && (
                <Title size={"s"}>{tittel}</Title>
            )}

            {innhold.map(({ spoersmaal, svar }) => (
                <TekstGruppe key={uuid()} tittel={spoersmaal} innhold={svar}/>
            ))}
        </Panel>
    );

    return (
        <>
            {soeknadOppsummering.map(({ tittel, elementer, path }: Gruppe) => (
                <Accordion heading={tittel} className={"oppsummering"} open={true} id={path} key={uuid()}>
                    {!elementer.length && (
                        <SkjemaGruppe>
                            <BodyLong>{t("felles.ingenInfo")}</BodyLong>
                        </SkjemaGruppe>
                    )}

                    {elementer.map(elementPanel)}

                    <Link to={`/soknad/steg/${path}`} className={senderSoeknad ? "disabled" : ""}>
                        <EditFilled className={"edit-svg"}/>
                        <span>{t("felles.endreSvar")}</span>
                    </Link>
                </Accordion>
            ))}
        </>
    )
});

export default OppsummeringInnhold;
