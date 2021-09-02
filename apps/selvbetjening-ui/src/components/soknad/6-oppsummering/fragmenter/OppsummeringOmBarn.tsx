import { SkjemaGruppe } from "nav-frontend-skjema";
import TekstGruppe from "./TekstGruppe";
import { v4 as uuid } from "uuid";
import { EditFilled } from "@navikt/ds-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StegPath } from "../../../../context/steg/steg";
import { IBarn, IOmBarn } from "../../../../typer/person";
import ObjectTreeReader from "../../../../utils/ObjectTreeReader";
import { Accordion, Link, Panel } from "@navikt/ds-react";

const OppsummeringOmBarn = ({
    opplysningerOmBarn,
    senderSoeknad,
}: {
    opplysningerOmBarn: IOmBarn;
    senderSoeknad: boolean;
}) => {
    const { t, i18n } = useTranslation();

    const otr = new ObjectTreeReader(i18n);

    const getBaseKey = (string: string) => {
        return string.replace(/(.\d+)/g, "");
    };
    // Nødvendig med en ID på dette formatet for å enkelt kunne verifisere med e2e tester.
    const unikBarnId = (key: string, i: number): string => {
        return `opplysningerOmBarn.barn.${i}.${key.split('omBarn.').pop()}`
    }

    return (
        <Accordion heading={t("omBarn.tittel")} className={"oppsummering"} open={true}>
            {opplysningerOmBarn.barn?.map((barn, i: number) => {
                const tekster: any[] = otr.traverse<IBarn>(barn, "omBarn");

                return (
                    <SkjemaGruppe key={`${barn.foedselsnummer}_${i}`} legend={`${barn.fornavn} ${barn.etternavn}`}>
                        <Panel border>
                            {tekster.map(({ key, val }) => (
                                <TekstGruppe key={uuid()} tittel={t(getBaseKey(key))} innhold={t(val)} id={unikBarnId(key, i)}/>
                            ))}
                        </Panel>
                    </SkjemaGruppe>
                );
            })}

            <TekstGruppe
                id={"opplysningerOmBarn.gravidEllerNyligFoedt"}
                tittel={t("omBarn.gravidEllerNyligFoedt")}
                innhold={t(opplysningerOmBarn.gravidEllerNyligFoedt!)}
            />

            <Link href={`/soknad/steg/${StegPath.OmBarn}`} className={senderSoeknad ? "disabled" : ""}>
                <EditFilled />
                <span>{t("felles.endreSvar")}</span>
            </Link>
        </Accordion>
    );
};

export default OppsummeringOmBarn;
