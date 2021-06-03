import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import React from "react";
import { IAvdoed } from "../../../../typer/person";

const OppsummeringAvdoed = ({ state }: { state: IAvdoed }) => {

    return (
        <Ekspanderbartpanel tittel={"Om avdøde"} className={"oppsummering"}  apen={true}>
            {/*<TekstGruppe tittel={""}*/}
        </Ekspanderbartpanel>
    )
}

export default OppsummeringAvdoed;
