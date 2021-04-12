import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { CheckboksPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import "react-datepicker/dist/react-datepicker.css";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp } from "nav-frontend-knapper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";
import Datovelger from "../../felles/Datovelger";

const SoeknadType: SoknadSteg = ({ neste }) => {
    const { state, dispatch } = useSoknadContext();

    const oppdaterValgtStoenad = (e: any) => {
        dispatch({ type: SoeknadActionTypes.VELG_STOENAD, payload: (e.target as HTMLInputElement).name });
    };

    const stoenadMedBeskjed = state.valgteStoenader.find((e) => e.beskjed && e.checked);

    return (
        <Panel>
            {/* Steg 1 */}

            {/* Dette kan kanskje være forsiden? Brukeren velger hvilken type søknad, og vi viser deretter nødvendige felter? */}

            <section>
                <Systemtittel>1 Hva søker du?</Systemtittel>
            </section>

            <section>
                <CheckboksPanelGruppe
                    // feil={state.error?.stønadMangler}
                    // name={'type'}
                    checkboxes={state.valgteStoenader.map((el, index) => {
                        return {
                            label: el.label,
                            checked: el.checked,
                            name: `${index}`,
                        };
                    })}
                    // checked={type}
                    onChange={oppdaterValgtStoenad}
                />
            </section>

            {/*
                    TODO: Lenke til skjemaer

                    Heter nå 17-09.01

                https://www.nav.no/soknader/nb/person/pensjon/gjenlevende-ektefelle-partner-eller-samboer#NAV151201


                Andre ytelser du kan ha krav på som gjenlevende. Stønad til barnetilsyn på grunn av arbeid.
                Du kan ha rett til stønad til barnetilsyn hvis du trenger tilsyn av barn på grunn av arbeid,
                (NAV 17-09.01).

                Stønad til skolepenger. Du kan ha rett til stønad til skolepenger ved nødvendig og hensiktsmessig
                utdanning. (NAV 17-09.01).

                */}

            {stoenadMedBeskjed && (
                <section>
                    <AlertStripe type="info">{stoenadMedBeskjed.beskjed}</AlertStripe>
                </section>
            )}

            <section>
                <SkjemaGruppe>
                    {/* TODO: Skal være fra måneden etter dødsfallet */}
                    <Datovelger
                        label={"Fra dato"}
                        valgtDato={state.fraDato}
                        onChange={(dato) => dispatch({ type: SoeknadActionTypes.SETT_FRA_DATO, payload: dato })}
                    />
                </SkjemaGruppe>

                <br />

                <AlertStripe type="info">
                    <strong>Etterbetaling:</strong> Ytelser gis som regel ikke for lengre tid tilbake enn tre måneder
                    før den kalendermåned da kravet blir satt fram. Barnepensjon etterbetales for opptil tre år før den
                    kalendermåned da kravet blir satt fram.
                </AlertStripe>
            </section>

            <section className={"center"}>
                <p>Du må svare på alle spørsmålene før du kan gå videre til neste steg</p>

                {/* TODO: Låse neste-knappen inntil alt er "utfylt". */}
                <Hovedknapp onClick={neste}>Neste</Hovedknapp>
            </section>
        </Panel>
    );
};

export default SoeknadType;
