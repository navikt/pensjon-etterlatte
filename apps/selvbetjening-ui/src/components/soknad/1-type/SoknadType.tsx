import { FC } from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { CheckboksPanelGruppe, Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { SoknadActionTypes } from "../../../context/soknad/soknad";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const SoknadType: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    const { state, dispatch } = useSoknadContext();

    const handleChange = (e: any) => {
        const target = e.target as HTMLInputElement;

        dispatch({ type: SoknadActionTypes.SET_TYPER, payload: { name: target.name, checked: target.checked } });
    };

    return (
        <div className="app">
            {/* Steg 1 */}

            {/* Dette kan kanskje være forsiden? Brukeren velger hvilken type søknad, og vi viser deretter nødvendige felter? */}
            <Panel>
                <Systemtittel>1 Hva søker du?</Systemtittel>

                <br />
            </Panel>

            <Panel>
                {/* TODO: Checkbox i stedet */}
                <CheckboksPanelGruppe
                    // name={'type'}
                    checkboxes={[
                        {
                            label: "Pensjon-/overgangsstønad",
                            name: "0",
                            checked: state.pensjonOvergangsstonad,
                        },
                        {
                            label: "Gjenlevendetillegg i uføretrygden",
                            name: "1",
                            checked: state.gjenlevendetillegg,
                        },
                        {
                            label: "Barnepensjon",
                            name: "2",
                            checked: state.barnepensjon,
                        },
                        {
                            label: "Stønad til barnetilsyn pga. arbeid",
                            name: "3",
                            checked: state.stonadTilBarnetilsyn,
                        },
                        {
                            label: "Stønad til skolepenger",
                            name: "4",
                            checked: state.stonadTilSkolepenger,
                        },
                    ]}
                    // checked={type}
                    onChange={handleChange}
                />

                <br />

                {(state.stonadTilBarnetilsyn || state.stonadTilSkolepenger) && (
                    <AlertStripe type="info">
                        Hvis du søker om stønad til barnetilsyn på grunn av arbeid eller stønad til skolepenger, vil NAV
                        ta kontakt.
                    </AlertStripe>
                )}

                <br />
                <SkjemaGruppe>
                    <Input label="Fra dato (dd.mm.åå)" />
                </SkjemaGruppe>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}

                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default SoknadType;
