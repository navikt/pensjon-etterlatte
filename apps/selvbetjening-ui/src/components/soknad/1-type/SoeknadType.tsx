import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import "react-datepicker/dist/react-datepicker.css";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IStoenadType, SoeknadActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";
import Datovelger from "../../felles/Datovelger";
import * as React from "react";
import { useEffect, useState } from "react";
import Sjekkboks from "../../felles/Sjekkboks";

const SoeknadType: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();
    const { stoenadType } = state;

    const initialState: IStoenadType = stoenadType || {
        fraDato: null,
        etterlatte: false,
        gjenlevendetillegg: false,
        barnepensjon: false,
        barnetilsyn: false,
        skolepenger: false,
    };

    const [stoenader, setStoenader] = useState(initialState);

    useEffect(() => {
        dispatch({ type: SoeknadActionTypes.OPPDATER_VALGTE_STOENADER, payload: stoenader });
    }, [stoenader, dispatch]);

    return (
        <>
            {/* Steg 1 */}

            {/* Dette kan kanskje være forsiden? Brukeren velger hvilken type søknad, og vi viser deretter nødvendige felter? */}

            <section>
                <Systemtittel>1 Hva søker du?</Systemtittel>
            </section>

            <section>
                <SkjemaGruppe className={"inputPanelGruppe"}>
                    <Sjekkboks
                        label={"Pensjon-/overgangsstønad"}
                        checked={stoenader.etterlatte}
                        onChange={(etterlatte) => {
                            console.log("oppdater sjekkboks");
                            setStoenader({ ...stoenader, etterlatte });
                        }}
                    />
                    <Sjekkboks
                        label={"Gjenlevendetillegg i uføretrygden"}
                        checked={stoenader.gjenlevendetillegg}
                        onChange={(gjenlevendetillegg) => setStoenader({ ...stoenader, gjenlevendetillegg })}
                    />
                    <Sjekkboks
                        label={"Barnepensjon"}
                        checked={stoenader.barnepensjon}
                        onChange={(barnepensjon) => setStoenader({ ...stoenader, barnepensjon })}
                    />
                    <Sjekkboks
                        label={"Stønad til barnetilsyn pga. arbeid"}
                        checked={stoenader.barnetilsyn}
                        onChange={(barnetilsyn) => setStoenader({ ...stoenader, barnetilsyn })}
                    />
                    <Sjekkboks
                        label={"Stønad til skolepenger"}
                        checked={stoenader.skolepenger}
                        onChange={(skolepenger) => setStoenader({ ...stoenader, skolepenger })}
                    />
                </SkjemaGruppe>
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

            {(stoenader.barnetilsyn || stoenader.skolepenger) && (
                <section>
                    <AlertStripe type="info">
                        Hvis du søker om stønad til barnetilsyn på grunn av arbeid eller stønad til skolepenger, vil NAV
                        ta kontakt.
                    </AlertStripe>
                </section>
            )}

            <section>
                <SkjemaGruppe>
                    <Datovelger
                        label={"Fra dato"}
                        valgtDato={stoenader.fraDato}
                        onChange={(fraDato) => setStoenader({ ...stoenader, fraDato })}
                    />
                </SkjemaGruppe>

                <AlertStripe type="info">
                    <strong>Etterbetaling:</strong> Ytelser gis som regel ikke for lengre tid tilbake enn tre måneder
                    før den kalendermåned da kravet blir satt fram. Barnepensjon etterbetales for opptil tre år før den
                    kalendermåned da kravet blir satt fram.
                </AlertStripe>
            </section>
        </>
    );
};

export default SoeknadType;
