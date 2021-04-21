import { useState } from "react";
import "./OpplysningerOmSokeren.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import InnloggetBruker from "./fragmenter/InnloggetBruker";
import SoekerSkjema from "./fragmenter/SoekerSkjema";
import ToValgRadio from "../../felles/ToValgRadio";
import AlertStripe from "nav-frontend-alertstriper";
import { IValg } from "../../../typer/ISpoersmaal";

const OpplysningerOmSokeren: SoknadSteg = () => {
    const { t } = useTranslation();

    const [bostedBekreftet, setBostedBekreftet] = useState<IValg>();

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>{t("omSoekeren.tittel")}</Systemtittel>

            <InnloggetBruker />

            <ToValgRadio
                label={t("omSoekeren.borPaaAdresse")}
                checked={bostedBekreftet}
                invert={true}
                onChange={setBostedBekreftet}
            >
                <AlertStripe type="advarsel" form={"inline"}>
                    {t("omSoekeren.infoFolkeregisteret")}
                </AlertStripe>
            </ToValgRadio>

            {bostedBekreftet === IValg.JA && <SoekerSkjema />}
        </>
    );
};

export default OpplysningerOmSokeren;
