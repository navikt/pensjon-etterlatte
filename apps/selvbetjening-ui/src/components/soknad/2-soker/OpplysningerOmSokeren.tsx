import "./OpplysningerOmSokeren.less";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import InnloggetBruker from "./fragmenter/InnloggetBruker";
import SoekerSkjema from "./fragmenter/SoekerSkjema";

const OpplysningerOmSokeren: SoknadSteg = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>{t("omSoekeren.tittel")}</Systemtittel>

            {/* Informasjon om den innloggede brukeren */}
            <InnloggetBruker />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <SoekerSkjema />
        </>
    );
};

export default OpplysningerOmSokeren;
