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
import { useTranslation } from "react-i18next";

const SoeknadType: SoknadSteg = () => {
    const { t } = useTranslation();
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
                <Systemtittel>{t("stoenadType.tittel")}</Systemtittel>
            </section>

            <section>
                <SkjemaGruppe className={"inputPanelGruppe"}>
                    <Sjekkboks
                        label={t("stoenadType.etterlatte")}
                        checked={stoenader.etterlatte}
                        onChange={(etterlatte) => setStoenader({ ...stoenader, etterlatte })}
                    />
                    <Sjekkboks
                        label={t("stoenadType.gjenlevendetillegg")}
                        checked={stoenader.gjenlevendetillegg}
                        onChange={(gjenlevendetillegg) => setStoenader({ ...stoenader, gjenlevendetillegg })}
                    />
                    <Sjekkboks
                        label={t("stoenadType.barnepensjon")}
                        checked={stoenader.barnepensjon}
                        onChange={(barnepensjon) => setStoenader({ ...stoenader, barnepensjon })}
                    />
                    <Sjekkboks
                        label={t("stoenadType.barnetilsyn")}
                        checked={stoenader.barnetilsyn}
                        onChange={(barnetilsyn) => setStoenader({ ...stoenader, barnetilsyn })}
                    />
                    <Sjekkboks
                        label={t("stoenadType.skolepenger")}
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
                    <AlertStripe type="info">{t("stoenadType.infoOmBarnetilsynOgSkolepenger")}</AlertStripe>
                </section>
            )}

            <section>
                <SkjemaGruppe>
                    <Datovelger
                        label={t("felles.fraDato")}
                        valgtDato={stoenader.fraDato}
                        onChange={(fraDato) => setStoenader({ ...stoenader, fraDato })}
                    />
                </SkjemaGruppe>

                <AlertStripe type="info">
                    <strong>{t("stoenadType.etterbetaling.tittel")}: </strong>
                    {t("stoenadType.etterbetaling.info")}
                </AlertStripe>
            </section>
        </>
    );
};

export default SoeknadType;
