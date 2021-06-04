import TekstGruppe from "./TekstGruppe";
import IValg from "../../../../typer/IValg";
import Lenke from "nav-frontend-lenker";
import { StegPath } from "../../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { IBarn } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { Ingress } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { v4 as uuid } from "uuid";

const OppsummeringBarn = ({ state }: { state: IBarn[] }) => {
    const { t } = useTranslation();

    return (
        <Ekspanderbartpanel tittel={"Om barn"} className={"oppsummering"} apen={true}>
            {state.map((barn) => (
                <div key={uuid()}>
                    <Ingress>{barn.fornavn} {barn.etternavn}</Ingress>

                    <Panel>
                        <TekstGruppe
                            tittel={t("felles.fnr")}
                            innhold={barn.foedselsnummer}
                        />
                        <TekstGruppe
                            tittel={t("opplysningerOmBarn.brukeAnnenKonto")}
                            innhold={barn.brukeAnnenKonto}
                        />
                        <TekstGruppe
                            tittel={t("opplysningerOmBarn.barnetsKontonummer")}
                            innhold={barn.kontonummer}
                        />
                        <TekstGruppe
                            tittel={"Hvilken relasjon har du til barnet?"}
                            innhold={barn.foreldre}
                        />
                        <TekstGruppe
                            tittel={t("opplysningerOmBarn.borUtenlands")}
                            innhold={barn.bosattUtland}
                        />

                        {barn.bosattUtland === IValg.JA && (
                            <>
                                <TekstGruppe
                                    tittel={t("felles.statsborgerskap")}
                                    innhold={barn.statsborgerskap}
                                />
                                <TekstGruppe
                                    tittel={t("felles.land")}
                                    innhold={barn.land}
                                />
                            </>
                        )}
                    </Panel>
                </div>
            ))}

            <Lenke href={`/soknad/steg/${StegPath.OmBarn}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringBarn;
