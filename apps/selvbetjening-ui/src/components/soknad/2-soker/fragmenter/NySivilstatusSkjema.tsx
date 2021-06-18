import { ISoeker, NySivilstatus, OpploesningAarsak } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import Panel from "nav-frontend-paneler";
import { Undertittel } from "nav-frontend-typografi";
import { useFormContext } from "react-hook-form";
import Datovelger from "../../../felles/Datovelger";
import { RHFToValgRadio, RHFRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { SkjemaGruppe } from "nav-frontend-skjema";

const NySivilstatusSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const nySivilstatus = watch("nySivilstatus.nySivilstatusEtterDoedsfallet");
    const harNySivilstatus = !!nySivilstatus && nySivilstatus !== NySivilstatus.ingen;

    const nyInngaaelseOpploest = watch("nySivilstatus.nySivilstatusOpploest")

    return (
        <Panel border>
            <Undertittel>Endret sivilstatus etter dødsfallet</Undertittel>

            <br />

            {/* 2.13 */}
            <RHFRadio
                name={"nySivilstatus.nySivilstatusEtterDoedsfallet"}
                legend={t("omSoekeren.nyInngaaelse.tittel")}
                radios={[
                    { label: t("omSoekeren.nyInngaaelse.ekteskap"), value: NySivilstatus.ekteskap },
                    { label: t("omSoekeren.nyInngaaelse.partnerskap"), value: NySivilstatus.partnerskap },
                    { label: t("omSoekeren.nyInngaaelse.samboerskap"), value: NySivilstatus.samboerskap },
                    { label: "Ingen", value: NySivilstatus.ingen },
                ]}
            />

            {harNySivilstatus && (
                <>
                    {/* 2.13 */}
                    <SkjemaGruppe>
                        <Datovelger
                            name={"nySivilstatus.datoForInngaaelse"}
                            label={t("omSoekeren.nyInngaaelse.dato")}
                        />
                    </SkjemaGruppe>

                    {/* 2.14 */}
                    <RHFToValgRadio
                        name={"nySivilstatus.nySivilstatusOpploest"}
                        legend={t("omSoekeren.nyInngaaelseOpploest")}
                    />

                    {/* 2.15 */}
                    {nyInngaaelseOpploest === IValg.JA && (
                        <>
                            <RHFRadio
                                name={"nySivilstatus.aarsakForOpploesningen"}
                                legend={t("omSoekeren.aarsakOpploesning.tittel")}
                                radios={[
                                    {
                                        label: t("omSoekeren.aarsakOpploesning.dødsfall"),
                                        value: OpploesningAarsak.doedsfall
                                    },
                                    {
                                        label: t("omSoekeren.aarsakOpploesning.skilsmisse"),
                                        value: OpploesningAarsak.skilsmisse
                                    },
                                    {
                                        label: t("omSoekeren.aarsakOpploesning.bruddISamboerskap"),
                                        value: OpploesningAarsak.bruddSamboerskap
                                    },
                                ]}
                            />

                            <SkjemaGruppe>
                                <Datovelger
                                    name={"nySivilstatus.datoForOpploesningen"}
                                    label={t("omSoekeren.nyInngaaelseOpploestDato")}
                                />
                            </SkjemaGruppe>
                        </>
                    )}
                </>
            )}
        </Panel>
    );
};

export default NySivilstatusSkjema;
