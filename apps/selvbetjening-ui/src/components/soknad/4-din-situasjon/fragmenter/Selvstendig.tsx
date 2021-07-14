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
                    label={"dinSituasjon.selvstendig.beskrivelse"}
                />

                <Datovelger
                    name={"selvstendig.startDato"}
                    label={"dinSituasjon.selvstendig.startDato"}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.type"}
                    label={"dinSituasjon.selvstendig.type"}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.endringIfmDoedsfall"}
                    label={"dinSituasjon.selvstendig.endringIfmDoedsfall"}
                    placeholder={"F.eks. endring i forventet inntekt eller drift av næring"}
                />
            </SkjemaGruppe>
        </>
    );
}

export default Selvstendig;
