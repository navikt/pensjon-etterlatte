import { SkjemaGruppe } from "nav-frontend-skjema";
import ToValgRadio from "../../../felles/ToValgRadio";
import { useTranslation } from "react-i18next";
import { useSoknadContext } from "../../../../context/soknad/SoknadContext";
import { ISoeker } from "../../../../typer/person";
import { useEffect, useState } from "react";
import TekstInput from "../../../felles/TekstInput";
import SamboerSkjema from "./SamboerSkjema";
import { ActionTypes } from "../../../../context/soknad/soknad";
import NySivilstatusSkjema from "./NySivilstatusSkjema";
import ForholdAvdoedSkjema from "./ForholdAvdoedSkjema";
import AlertStripe from "nav-frontend-alertstriper";
import { IValg } from "../../../../typer/ISpoersmaal";
import KontaktinfoSkjema from "./KontaktinfoSkjema";

const SoekerSkjema = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const initialState: ISoeker = state.opplysningerOmSoekeren || {};

    const [soeker, setSoeker] = useState(initialState);

    useEffect(() => {
        dispatch({ type: ActionTypes.OPPDATER_SOEKER, payload: soeker });
    }, [soeker, dispatch]);

    return (
        <SkjemaGruppe>
            <ToValgRadio
                label={t("omSoekeren.borPaaAdresse")}
                checked={soeker.bostedsadresseBekreftet}
                invert={true}
                onChange={(bostedsadresseBekreftet) => setSoeker({ ...soeker, bostedsadresseBekreftet })}
            >
                <AlertStripe type="advarsel" form={"inline"}>
                    {t("omSoekeren.infoFolkeregisteret")}
                </AlertStripe>
            </ToValgRadio>

            {soeker.bostedsadresseBekreftet === IValg.JA && (
                <>
                    <KontaktinfoSkjema
                        kontaktinfo={soeker?.kontaktinfo}
                        setKontaktinfo={(kontaktinfo) => setSoeker({ ...soeker, kontaktinfo })}
                    />

                    {/* 2.7 */}
                    <ToValgRadio
                        label={t("omSoekeren.oppholderSegINorge")}
                        checked={soeker?.oppholderSegINorge}
                        invert={true}
                        onChange={(oppholderSegINorge) => setSoeker({ ...soeker, oppholderSegINorge })}
                    >
                        <TekstInput
                            label={t("omSoekeren.oppgiLand")}
                            value={soeker.oppholdsland}
                            onChange={(oppholdsland) => setSoeker({ ...soeker, oppholdsland })}
                        />
                    </ToValgRadio>

                    <ToValgRadio
                        label={t("omSoekeren.medlemFolketrygdenUtland")}
                        checked={soeker.medlemFolketrygdenUtland}
                        onChange={(medlemFolketrygdenUtland) => setSoeker({ ...soeker, medlemFolketrygdenUtland })}
                    />

                    {/* 2.8 */}
                    <TekstInput
                        label={t("omSoekeren.norskKontonummer")}
                        value={soeker?.kontonummer}
                        onChange={(kontonummer) => setSoeker({ ...soeker, kontonummer })}
                    />
                    {/* TODO: Automatisk fylle inn kontonummer vi har, men gi bruker mulighet til å endre. */}

                    {/* 2.9 */}
                    <ForholdAvdoedSkjema
                        forholdTilAvdoed={soeker.forholdTilAvdoed}
                        setForholdTilAvdoed={(forholdTilAvdoed) => setSoeker({ ...soeker, forholdTilAvdoed })}
                    />

                    <br />

                    <NySivilstatusSkjema
                        nySivilstatus={soeker.nySivilstatus}
                        setNySivilstatus={(nySivilstatus) => setSoeker({ ...soeker, nySivilstatus })}
                    />

                    <br />

                    {soeker.nySivilstatus?.nySivilstatusEtterDoedsfallet === "Samboerskap" && (
                        <SamboerSkjema
                            samboer={soeker.samboer}
                            setSamboer={(samboer) => setSoeker({ ...soeker, samboer })}
                        />
                    )}
                </>
            )}
        </SkjemaGruppe>
    );
};

export default SoekerSkjema;
