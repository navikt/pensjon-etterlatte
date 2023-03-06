import { useBrukerContext } from "../context/bruker/BrukerContext";
import Veileder from "nav-frontend-veileder";
import ikon from "../assets/ikoner/veileder.svg";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ActionTypes } from "../context/bruker/bruker";
import { erForUng } from "../utils/alder";
import { useHistory } from "react-router-dom";
import { BodyLong, Button, Link } from "@navikt/ds-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {NavigasjonsRadSection} from "./felles/StyledComponents";

const UgyldigSoeker = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const { state, dispatch } = useBrukerContext();

    useEffect(() => {
        if (state.kanSoeke) {
            history.push("/");
        }
    }, [state.kanSoeke])

    const brukerErForUng = erForUng(state.alder!!);

    const heiTekst = brukerErForUng
        ? t("ugyldigSoeker.kanIkkeSoeke.gjenlevendeEllerBarnepensjon")
        : t("ugyldigSoeker.kanIkkeSoeke.gjenlevende");

    const tilbake = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL });

        window.location.href = "https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle"
    };

    return (
        <>
            <SkjemaGruppe>
                {brukerErForUng ? (
                    <Veileder tekst={heiTekst} posisjon="høyre">
                        <img alt="veileder" src={ikon}/>
                    </Veileder>
                ) : (
                    <Veileder tekst={heiTekst} posisjon="høyre">
                        <img alt="veileder" src={ikon}/>
                    </Veileder>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                {brukerErForUng ? (
                    <BodyLong>
                        {t("ugyldigSoeker.info.gjenlevendeEllerBarnepensjon")}
                    </BodyLong>
                ) : (
                    <BodyLong>
                        {t("ugyldigSoeker.info.gjenlevende")}
                    </BodyLong>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    {brukerErForUng ? (
                        <Link href={t("ugyldigSoeker.infolenker.barnepensjon.href")}>
                            {t("ugyldigSoeker.infolenker.barnepensjon.tekst")}
                        </Link>
                    ) : (
                        <Link href={t("ugyldigSoeker.infolenker.alderspensjon.href")}>
                            {t("ugyldigSoeker.infolenker.alderspensjon.tekst")}
                        </Link>
                    )}ﬂ
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <NavigasjonsRadSection>
                    <Button variant={"primary"} onClick={tilbake}>{t("knapp.tilbake")}</Button>
                </NavigasjonsRadSection>
            </SkjemaGruppe>
        </>
    );
};

export default UgyldigSoeker;
