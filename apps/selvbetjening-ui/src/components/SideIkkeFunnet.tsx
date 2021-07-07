import { FC } from "react";
import Panel from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";

const SideIkkeFunnet: FC = () => {
    return (
        <Panel>
            <Systemtittel>Oi, her var det noe rusk</Systemtittel>

            <br />
            <AlertStripe type="feil">Siden du har etterspurt finnes ikke.</AlertStripe>
        </Panel>
    );
};

export default SideIkkeFunnet;
