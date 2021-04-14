import React, { FC } from "react";
import { EditFilled } from "@navikt/ds-icons";
import { Flatknapp } from "nav-frontend-knapper";

interface Props {
    title: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const RedigerKnapp: FC<Props> = ({ title, onClick }) => {
    return (
        <Flatknapp title={title} onClick={onClick} kompakt>
            <EditFilled />
        </Flatknapp>
    );
};

export default RedigerKnapp;
