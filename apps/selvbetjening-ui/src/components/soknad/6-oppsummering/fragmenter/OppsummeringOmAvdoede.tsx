import { SkjemaGruppe } from "nav-frontend-skjema";
import TekstGruppe from "./TekstGruppe";
import { v4 as uuid } from "uuid";
import { EditFilled } from "@navikt/ds-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StegPath } from "../../../../context/steg/steg";
import { IAvdoed, IOppholdUtland } from "../../../../typer/person";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";
import { Accordion, Link, Panel } from "@navikt/ds-react";

const OppsummeringOmAvdoed = ({
    opplysningerOmAvdoede,
    senderSoeknad,
}: {
    opplysningerOmAvdoede: IAvdoed;
    senderSoeknad: boolean;
}) => {
    const { t, i18n } = useTranslation();
    const otr = new ObjectTreeReader(i18n);
    const formatter = Intl.DateTimeFormat(i18n.language, { month: "short", year: "numeric" });

    const getBaseKey = (string: string) => string.replace(/(.\d+)/g, "");
    const formatDate = (date?: Date) => (date ? formatter.format(new Date(date)) : "");
    const oppholdUtlandTeksterPrefix = "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland";

    // Nødvendig med en ID på dette formatet for å enkelt kunne verifisere med e2e tester.
    const unikOppholdUtlandId = (key: string, i: number): string => {
        return `${oppholdUtlandTeksterPrefix}.${i}${key.split(oppholdUtlandTeksterPrefix).pop()}`;
    };
    const teksterUtenOppholdUtland: any[] = otr
        .traverse<IAvdoed>(opplysningerOmAvdoede, "omDenAvdoede")
        .filter(({ key }) => !key.startsWith(oppholdUtlandTeksterPrefix));

    const oppholdUtlandPanel = opplysningerOmAvdoede.boddEllerJobbetUtland?.oppholdUtland?.map((opphold, i: number) => {
        const oppholdUtlandTekster: any[] = otr.traverse<IOppholdUtland>(opphold, oppholdUtlandTeksterPrefix);

        const dateFields = [`${oppholdUtlandTeksterPrefix}.fraDato`, `${oppholdUtlandTeksterPrefix}.tilDato`];

        return (
            <SkjemaGruppe
                key={`${opphold.land}_${i}`}
                legend={`${opphold.land} (${formatDate(opphold.fraDato)} - ${formatDate(opphold.tilDato)})`}
            >
                <Panel border>
                    {oppholdUtlandTekster
                        .filter((t) => !dateFields.includes(t.key))
                        .map(({ key, val }) => (
                            <TekstGruppe
                                key={uuid()}
                                tittel={t(getBaseKey(key))}
                                innhold={t(val)}
                                id={unikOppholdUtlandId(key, i)}
                            />
                        ))}
                </Panel>
            </SkjemaGruppe>
        );
    });

    return (
        <Accordion heading={t("omDenAvdoede.tittel")} className={"oppsummering"} open={true}>
            {teksterUtenOppholdUtland.map(({ key, val }) => (
                <div key={uuid()}>
                    <TekstGruppe key={uuid()} tittel={t(getBaseKey(key))} innhold={t(val)} id={key} />
                    {key === "omDenAvdoede.boddEllerJobbetUtland.svar" && oppholdUtlandPanel}
                </div>
            ))}

            <Link href={`/soknad/steg/${StegPath.OmAvdoed}`} className={senderSoeknad ? "disabled" : ""}>
                <EditFilled />
                <span>{t("felles.endreSvar")}</span>
            </Link>
        </Accordion>
    );
};

export default OppsummeringOmAvdoed;
