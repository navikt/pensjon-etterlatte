import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { CheckboksPanelGruppe, Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp } from "nav-frontend-knapper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { SoknadActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";

const SoknadType: SoknadSteg = ({ neste }) => {
    const { state, dispatch } = useSoknadContext();

    const handleChange = (e: any) => {
        const target = e.target as HTMLInputElement;

        dispatch({ type: SoknadActionTypes.SET_TYPER, payload: { name: target.name, checked: target.checked } });
    };

    return (
        <Panel>
            {/* Steg 1 */}

            {/* Dette kan kanskje være forsiden? Brukeren velger hvilken type søknad, og vi viser deretter nødvendige felter? */}

            <section>
                <Systemtittel>1 Hva søker du?</Systemtittel>
            </section>

            <section>
                <CheckboksPanelGruppe
                    feil={state.error?.stønadMangler}
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

            {(state.stonadTilBarnetilsyn || state.stonadTilSkolepenger) && (
                <section>
                    <AlertStripe type="info">
                        Hvis du søker om stønad til barnetilsyn på grunn av arbeid eller stønad til skolepenger, vil NAV
                        ta kontakt.
                    </AlertStripe>
                </section>
            )}

            <section>
                <SkjemaGruppe feil={state.error?.datoMangler}>
                    {/* TODO: Skal være fra måneden etter dødsfallet */}
                    <Input
                        label="Fra dato (mm.åå)"
                        value={state.fraDato}
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;

                            dispatch({ type: SoknadActionTypes.SET_FRA_DATO, payload: target.value });
                        }}
                    />
                </SkjemaGruppe>

                <AlertStripe type="info" form={"inline"}>
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

export default SoknadType;
