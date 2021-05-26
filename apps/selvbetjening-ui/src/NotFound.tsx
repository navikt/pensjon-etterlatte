import React, { FC } from "react";
import "./App.less";
import Panel from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";

const NotFound: FC = () => {
    return (
        <Panel>
            <Systemtittel>Oi, her var det noe rusk</Systemtittel>

            <br />
            <AlertStripe type="feil">Siden du har etterspurt finnes ikke.</AlertStripe>
        </Panel>
    );
};

export default NotFound;
