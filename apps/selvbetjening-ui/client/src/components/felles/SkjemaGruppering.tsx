import { FC } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { SkjemaGruppeProps } from "nav-frontend-skjema/lib/skjema-gruppe";

const SkjemaGruppering: FC<SkjemaGruppeProps> = ({ children }) => {
    return (
        <SkjemaGruppe className={"skjemagruppering"}>
            {children}
        </SkjemaGruppe>
    )
}

export default SkjemaGruppering;
