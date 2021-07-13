import { RHFInput } from "../../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import Datovelger from "../../../felles/Datovelger";
import { Undertittel } from "nav-frontend-typografi";

const Selvstendig = () => {

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>Info om næring</Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFInput
                    className={"kol-75"}
                    name={"selvstendig.beskrivelse"}
                    label={"Hvilken næring driver du?"}
                />

                <Datovelger
                    name={"selvstendig.startDato"}
                    label={"Når startet du?"}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.type"}
                    label={"Hvilken type næring er dette?"}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.endringIfmDoedsfall"}
                    label={"Har det skjedd noen endring i næringen som følge av dødsfall?"}
                    placeholder={"F.eks. endring i forventet inntekt eller drift av næring"}
                />
            </SkjemaGruppe>
        </>
    );
}

export default Selvstendig;
