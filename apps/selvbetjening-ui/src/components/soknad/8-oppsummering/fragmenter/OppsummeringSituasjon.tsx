import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { ISituasjon } from "../../../../typer/ytelser";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Element, Normaltekst } from "nav-frontend-typografi";
import React from "react";
import { useTranslation } from "react-i18next";


const OppsummeringSituasjon = ({ state }: { state: ISituasjon }) => {
    const { t } = useTranslation();

    const hovedytelse = state.valgteYtelser?.hovedytelse;

    return (
        <Ekspanderbartpanel tittel={"Din situasjon"} className={"oppsummering"}  apen={true}>
            <SkjemaGruppe>
                <Element>Valgt ytelse: </Element>
                <Normaltekst>{t(`stoenadType.${hovedytelse}`)}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Element>Søker barnepensjon?</Element>
                <Normaltekst>{state.valgteYtelser?.barnepensjon}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Element>Fra dato: </Element>
                <Normaltekst>{state.fraDato}</Normaltekst>
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    )
}

export default OppsummeringSituasjon;
