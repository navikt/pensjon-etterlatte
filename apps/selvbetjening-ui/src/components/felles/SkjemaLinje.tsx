import { FC } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { SkjemaGruppeProps } from "nav-frontend-skjema/lib/skjema-gruppe";

const SkjemaLinje: FC<SkjemaGruppeProps> = ({ children }) => {
    return (
        <SkjemaGruppe className={"skjemalinje"}>
            {children}
        </SkjemaGruppe>
    )
}

export default SkjemaLinje;
