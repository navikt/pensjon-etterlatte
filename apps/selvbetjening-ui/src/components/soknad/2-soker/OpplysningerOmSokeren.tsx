import React, { useEffect, useState } from "react";
import "./OpplysningerOmSokeren.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { hentInnloggetPerson } from "../../../api";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IPdlPerson } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import ToValgRadio from "../../felles/ToValgRadio";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import Datovelger from "../../felles/Datovelger";
import Sjekkboks from "../../felles/Sjekkboks";
import InnloggetBruker from "./InnloggetBruker";

const OpplysningerOmSokeren: SoknadSteg = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const { opplysningerOmSoekeren } = state;

    useEffect(() => {
        if (!opplysningerOmSoekeren) {
            hentInnloggetPerson().then((person: IPdlPerson) => {
                dispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
            });
        }
    }, [opplysningerOmSoekeren, dispatch]);

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>{t("omSoekeren.tittel")}</Systemtittel>

            <InnloggetBruker />

            {/* TODO: */}
            <SkjemaGruppe>
                {/* 2.4 */}
                <Input
                    type={"tel"}
                    label={t("felles.telefon")}
                    value={opplysningerOmSoekeren?.kontaktinfo?.telefonnummer}
                    onChange={(e) => {
                        dispatch({
                            type: ActionTypes.SETT_TELEFON,
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
                            type: ActionTypes.SETT_EPOST,
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
                        dispatch({ type: ActionTypes.OPPHOLD_NORGE, payload: valgtSvar });
                    }}
                >
                    <Input label={t("omSoekeren.oppgiLand")} value={""} onChange={() => {}} />
                </ToValgRadio>

                <ToValgRadio label={t("omSoekeren.medlemFolketrygdenUtland")} onChange={() => {}} />

                {/* 2.8 */}
                <Input
                    label={t("omSoekeren.norskKontonummer")}
                    value={opplysningerOmSoekeren?.kontonummer}
                    onChange={() => {}}
                />
                {/* TODO: Automatisk fylle inn kontonummer vi har, men gi bruker mulighet til å endre. */}

                {/* 2.9 */}
                {/* TODO: Sjekkbokser i stedet for å forenkle punkt 2.10 ? */}
                <RadioPanelGruppe
                    name={"forholdTilAvdoede"}
                    legend={t("omSoekeren.forholdTilAvdoede.tittel")}
                    radios={[
                        { label: t("omSoekeren.forholdTilAvdoede.ektefelle"), value: "Gjenlevende ektefelle" },
                        { label: t("omSoekeren.forholdTilAvdoede.partner"), value: "Gjenlevende partner" },
                        { label: t("omSoekeren.forholdTilAvdoede.samboer"), value: "Gjenlevende samboer" },
                        {
                            label: t("omSoekeren.forholdTilAvdoede.ugift"),
                            value: "Ugift, men ble forsørget av den avdøde",
                        },
                    ]}
                    checked={""}
                    onChange={() => {}}
                />

                {/* 2.9 */}
                <Datovelger
                    label={t("omSoekeren.forholdTilAvdoede.datoForPartnerskap")}
                    valgtDato={null}
                    onChange={() => {}}
                />

                {/* 2.10 */}
                {/* TODO: Kun vise hvis samboer er valgt */}
                <ToValgRadio label={t("omSoekeren.gjenlevendeSamboer")} onChange={() => {}} />

                {/* 2.11 */}
                <ToValgRadio label={t("omSoekeren.varSkiltFraAvdoede")} onChange={() => {}}>
                    <Datovelger label={t("omSoekeren.datoForSamlivsbrudd")} valgtDato={null} onChange={() => {}} />
                </ToValgRadio>

                {/* 2.12 */}
                <ToValgRadio label={t("omSoekeren.mottokBidragFraAvdoede")} onChange={() => {}}>
                    <Input label={t("omSoekeren.bidragBeloep")} value={""} onChange={() => {}} />
                </ToValgRadio>

                {/* 2.13 */}
                <RadioPanelGruppe
                    name={"barn-opphav"}
                    legend={t("omSoekeren.nyInngaaelse.tittel")}
                    radios={[
                        { label: t("omSoekeren.nyInngaaelse.ekteskap"), value: "Ekteskap" },
                        { label: t("omSoekeren.nyInngaaelse.partnerskap"), value: "Partnerskap" },
                        { label: t("omSoekeren.nyInngaaelse.samboerskap"), value: "Samboerskap" },
                    ]}
                    checked={""}
                    onChange={() => {}}
                />

                {/* 2.13 */}
                <Datovelger label={t("omSoekeren.nyInngaaelse.dato")} valgtDato={null} onChange={() => {}} />

                {/* 2.14 */}
                <ToValgRadio label={t("omSoekeren.nyInngaaelseOpploest")} onChange={() => {}}>
                    {/* 2.15 */}
                    <RadioPanelGruppe
                        name={"aarsak-opploesning"}
                        legend={t("omSoekeren.aarsakOpploesning.tittel")}
                        radios={[
                            { label: t("omSoekeren.aarsakOpploesning.dødsfall"), value: "Dødsfall" },
                            { label: t("omSoekeren.aarsakOpploesning.skilsmisse"), value: "Skilsmisse" },
                            {
                                label: t("omSoekeren.aarsakOpploesning.bruddISamboerskap"),
                                value: "Brudd i samboerskap",
                            },
                        ]}
                        checked={""}
                        onChange={() => {}}
                    />

                    <Datovelger label={t("omSoekeren.nyInngaaelseOpploestDato")} valgtDato={null} onChange={() => {}} />
                </ToValgRadio>

                {/* 2.16 */}
                <Input label={t("omSoekeren.oppgiNavnSamboer")} value={""} onChange={() => {}} />

                <Input label={t("felles.fnr")} value={""} onChange={() => {}} />

                <ToValgRadio label={t("omSoekeren.harHattBarnEllerVaertGiftMedSamboer")} onChange={() => {}} />

                {/* 2.17 */}
                <ToValgRadio label={t("omSoekeren.harSamboerInntekt.tittel")} onChange={() => {}}>
                    <SkjemaGruppe className={"inputPanelGruppe"}>
                        <Sjekkboks
                            label={t("omSoekeren.harSamboerInntekt.arbeidsinntekt")}
                            checked={false}
                            onChange={() => {}}
                        />
                        <Sjekkboks
                            label={t("omSoekeren.harSamboerInntekt.pensjon")}
                            checked={false}
                            onChange={() => {}}
                        />
                        <Sjekkboks
                            label={t("omSoekeren.harSamboerInntekt.kapitalinntekt")}
                            checked={false}
                            onChange={() => {}}
                        />
                        <Sjekkboks
                            label={t("omSoekeren.harSamboerInntekt.andreYtelser")}
                            checked={false}
                            onChange={() => {}}
                        />
                    </SkjemaGruppe>

                    <Input label={t("omSoekeren.harSamboerInntekt.bruttoinntekt")} value={""} onChange={() => {}} />
                </ToValgRadio>
            </SkjemaGruppe>

            {/* Mulighet for å fylle inn barnets kontonr. */}

            {/*
                    Skal kun være ett felt for kontonr som hentes fra NAV sine systemer.
                    Bruker skal kunne endre kontonr, men må informeres om at vi kun forholder oss til ETT nr.
                */}
        </>
    );
};

export default OpplysningerOmSokeren;
