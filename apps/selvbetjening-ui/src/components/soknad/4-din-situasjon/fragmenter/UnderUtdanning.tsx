import { Undertittel } from "nav-frontend-typografi";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";

const UnderUtdanning = () => {
    return (
        <>
            <SkjemaGruppe>
                <Undertittel>
                    Hvilken utdanning holder du på med?
                </Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"utdanning.naavaerendeUtdanning.navn"}
                    label={"Navn på utdanning"}
                />
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <Datovelger
                    name={"utdanning.naavaerendeUtdanning.startDato"}
                    label={"Fra dato"}
                />

                <Datovelger
                    name={"utdanning.naavaerendeUtdanning.sluttDato"}
                    label={"Til dato"}
                />
            </SkjemaGruppe>
        </>
    )
}

export default UnderUtdanning;
