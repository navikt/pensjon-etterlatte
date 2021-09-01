import { FC } from "react";
import Panel from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
import { Alert } from "@navikt/ds-react";

const SideIkkeFunnet: FC = () => {
    return (
        <Panel>
            <Systemtittel>Oi, her var det noe rusk</Systemtittel>

            <br />
            <Alert variant={"warning"}>Siden du har etterspurt finnes ikke.</Alert>
        </Panel>
    );
};

export default SideIkkeFunnet;
