import { INySivilstatus } from "../../../../typer/person";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import Datovelger from "../../../felles/Datovelger";
import ToValgRadio from "../../../felles/ToValgRadio";
import { useTranslation } from "react-i18next";
import { Panel } from "nav-frontend-paneler";
import { Undertittel } from "nav-frontend-typografi";

interface Props {
    nySivilstatus?: INySivilstatus;
    setNySivilstatus: (nySivilstatus: INySivilstatus) => void;
}

const NySivilstatusSkjema = ({ nySivilstatus, setNySivilstatus }: Props) => {
    const { t } = useTranslation();

    return (
        <Panel border>
            <Undertittel>Endret sivilstatus etter dødsfallet</Undertittel>

            <br />

            {/* 2.13 */}
            <RadioPanelGruppe
                name={"barn-opphav"}
                legend={t("omSoekeren.nyInngaaelse.tittel")}
                radios={[
                    { label: t("omSoekeren.nyInngaaelse.ekteskap"), value: "Ekteskap" },
                    { label: t("omSoekeren.nyInngaaelse.partnerskap"), value: "Partnerskap" },
                    { label: t("omSoekeren.nyInngaaelse.samboerskap"), value: "Samboerskap" },
                    { label: "Ingen", value: "" },
                ]}
                checked={nySivilstatus?.nySivilstatusEtterDoedsfallet}
                onChange={(e) =>
                    setNySivilstatus({
                        ...nySivilstatus,
                        nySivilstatusEtterDoedsfallet: (e.target as HTMLInputElement).value,
                    })
                }
            />

            {!!nySivilstatus?.nySivilstatusEtterDoedsfallet && (
                <>
                    {/* 2.13 */}
                    <Datovelger
                        label={t("omSoekeren.nyInngaaelse.dato")}
                        valgtDato={nySivilstatus?.datoForInngaaelse}
                        onChange={(datoForInngaaelse) => setNySivilstatus({ ...nySivilstatus, datoForInngaaelse })}
                    />

                    {/* 2.14 */}
                    <ToValgRadio
                        label={t("omSoekeren.nyInngaaelseOpploest")}
                        checked={nySivilstatus?.nySivilstatusOpploest}
                        onChange={(nySivilstatusOpploest) =>
                            setNySivilstatus({ ...nySivilstatus, nySivilstatusOpploest })
                        }
                    >
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
                            checked={nySivilstatus?.aarsakForOpploesningen}
                            onChange={(e) =>
                                setNySivilstatus({
                                    ...nySivilstatus,
                                    aarsakForOpploesningen: (e.target as HTMLInputElement).value,
                                })
                            }
                        />

                        <Datovelger
                            label={t("omSoekeren.nyInngaaelseOpploestDato")}
                            valgtDato={nySivilstatus?.datoForOpploesningen}
                            onChange={(datoForOpploesningen) =>
                                setNySivilstatus({
                                    ...nySivilstatus,
                                    datoForOpploesningen,
                                })
                            }
                        />
                    </ToValgRadio>
                </>
            )}
        </Panel>
    );
};

export default NySivilstatusSkjema;
