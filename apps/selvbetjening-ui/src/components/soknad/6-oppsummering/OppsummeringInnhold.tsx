import { Element, Gruppe } from "../../../utils/ObjectTreeReader";
import { Accordion, BodyLong, Panel, Heading } from "@navikt/ds-react";
import { v4 as uuid } from "uuid";
import TekstGruppe from "./fragmenter/TekstGruppe";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { EditFilled } from "@navikt/ds-icons";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AccordionItem } from "./AccordionItem";

const OppsummeringInnhold = memo(
    ({ soeknadOppsummering, senderSoeknad }: { soeknadOppsummering: Gruppe[]; senderSoeknad: boolean }) => {
        const { t } = useTranslation();

        const elementPanel = ({ tittel, innhold }: Element) => (
            <Panel key={uuid()}>
                {tittel && <Heading size={"small"}>{tittel}</Heading>}

                {innhold.map(({ spoersmaal, svar }) => (
                    <TekstGruppe key={uuid()} tittel={spoersmaal} innhold={svar} />
                ))}
            </Panel>
        );

        return (
            <>
                <Accordion>
                    {soeknadOppsummering.map(({ tittel, elementer, path }: Gruppe) => (
                        <AccordionItem key={uuid()} tittel={tittel}>
                                {!elementer.length && (
                                    <SkjemaGruppe>
                                        <BodyLong>{t("felles.ingenInfo")}</BodyLong>
                                    </SkjemaGruppe>
                                )}

                                {elementer.map(elementPanel)}

                                <Link to={`/soknad/steg/${path}`} className={senderSoeknad ? "disabled" : ""}>
                                    <EditFilled className={"edit-svg"} />
                                    <span>{t(`endreSvarOppsummering.${path}`)}</span>
                                </Link>
                            </AccordionItem>
                    ))}
                </Accordion>
            </>
        );
    }
);

export default OppsummeringInnhold;
