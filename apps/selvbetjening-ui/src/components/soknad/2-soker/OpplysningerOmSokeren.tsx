import React, { useEffect } from "react";
import "./OpplysningerOmSokeren.less";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { hentInnloggetPerson } from "../../../api";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IPdlPerson } from "../../../typer/person";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";
import ToValgRadio from "../../felles/ToValgRadio";
import { Input } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const OpplysningerOmSokeren: SoknadSteg = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const { opplysningerOmSoekeren } = state;

    useEffect(() => {
        if (!opplysningerOmSoekeren) {
            hentInnloggetPerson().then((person: IPdlPerson) => {
                dispatch({ type: SoeknadActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
            });
        }
    }, [opplysningerOmSoekeren, dispatch]);

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>{t("omSoekeren.tittel")}</Systemtittel>

            <br />
            <AlertStripe type="advarsel">{t("omSoekeren.advarsel")}</AlertStripe>
            <br />

            {!!opplysningerOmSoekeren && (
                <div className={"opplysninger"}>
                    <section>
                        <Element>{t("felles.fnrDnr")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.foedselsnummer}</Normaltekst>
                    </section>

                    <section>
                        <Element>{t("felles.navn")}</Element>
                        <Normaltekst>
                            {opplysningerOmSoekeren.navn?.fornavn} {opplysningerOmSoekeren.navn?.etternavn}
                        </Normaltekst>
                    </section>

                    {/* 2.3 */}
                    <section>
                        <Element>{t("felles.adresse")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.bosted?.adresse}</Normaltekst>
                    </section>

                    <section>
                        <Element>{t("felles.sivilstatus")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.sivilstatus}</Normaltekst>
                    </section>

                    {/* 2.6 */}
                    <section>
                        <Element>{t("felles.statsborgerskap")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.statsborgerskap}</Normaltekst>
                    </section>
                </div>
            )}

            <ToValgRadio
                label={t("omSoekeren.borPaaAdresse")}
                checked={opplysningerOmSoekeren?.bosted?.boadresseBekreftet}
                invert={true}
                onChange={(valgtSvar) => {
                    dispatch({ type: SoeknadActionTypes.BEKREFT_BOADRESSE, payload: valgtSvar });
                }}
            >
                <AlertStripe type="advarsel" form={"inline"}>
                    {t("omSoekeren.infoFolkeregisteret")}
                </AlertStripe>
            </ToValgRadio>

            {/* TODO: */}
            <div style={{ pointerEvents: "none", opacity: ".4" }}>
                {/* 2.4 */}
                <Input
                    type={"tel"}
                    label={t("felles.telefon")}
                    value={opplysningerOmSoekeren?.kontaktinfo?.telefonnummer}
                    onChange={(e) => {
                        dispatch({
                            type: SoeknadActionTypes.SETT_TELEFON,
                            payload: (e.target as HTMLInputElement).value,
                        });
                    }}
                />

                {/* 2.5 */}
                <Input
                    label={t("felles.epost")}
                    value={opplysningerOmSoekeren?.kontaktinfo?.epost}
                    onChange={(e) => {
                        dispatch({
                            type: SoeknadActionTypes.SETT_EPOST,
                            payload: (e.target as HTMLInputElement).value,
                        });
                    }}
                />

                {/* 2.7 */}
                <ToValgRadio
                    label={t("omSoekeren.oppholderSegINorge")}
                    checked={opplysningerOmSoekeren?.bosted?.oppholderSegINorge}
                    invert={true}
                    onChange={(valgtSvar) => {
                        dispatch({ type: SoeknadActionTypes.OPPHOLD_NORGE, payload: valgtSvar });
                    }}
                >
                    <Input label={t("omSoekeren.oppgiLand")} value={""} onChange={() => {}} />
                </ToValgRadio>
            </div>

            {/* Mulighet for å fylle inn barnets kontonr. */}

            {/*
                    Skal kun være ett felt for kontonr som hentes fra NAV sine systemer.
                    Bruker skal kunne endre kontonr, men må informeres om at vi kun forholder oss til ETT nr.
                */}
        </>
    );
};

export default OpplysningerOmSokeren;
