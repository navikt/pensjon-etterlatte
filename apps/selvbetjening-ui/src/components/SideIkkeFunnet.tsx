import { Alert, Panel, Title } from "@navikt/ds-react";

const SideIkkeFunnet = () => {
    return (
        <Panel>
            <Title size={"m"}>Oi, her var det noe rusk</Title>

            <br />
            <Alert variant={"warning"}>Siden du har etterspurt finnes ikke.</Alert>
        </Panel>
    );
};

export default SideIkkeFunnet;
