import { Route } from "react-router";
import SoknadForside from "./SoknadForside";
import SoknadDialog from "./SoknadDialog";
import SoknadKvittering from "./SoknadKvittering";
import Admin from "../dev/Admin";
import LoaderOverlay from "../felles/LoaderOverlay";
import useSoeknad from "../../hooks/useSoeknad";
import { FortsettSoeknadModal } from "./FortsettSoeknadModal";

const Soeknad = () => {
    const lasterSoeknad = useSoeknad();
    
    return (
        <>
            <LoaderOverlay visible={lasterSoeknad} label={"Henter søknadsinformasjon ..."} />

            {!lasterSoeknad && <FortsettSoeknadModal />}

            {/* TODO: Kun i dev/qa*/}
            <Route path={"/skjema/admin"} component={Admin} />

            <Route path={"/skjema/steg"} component={SoknadDialog} />

            <Route path={"/skjema/sendt"} component={SoknadKvittering} />

            <Route exact path={"/"} component={SoknadForside} />
        </>
    );
}

export default Soeknad;
