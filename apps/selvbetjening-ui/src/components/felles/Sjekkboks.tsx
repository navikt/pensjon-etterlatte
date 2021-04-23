import React, { FC } from "react";
import { CheckboksPanel } from "nav-frontend-skjema";

interface Props {
    label: string;
    checked?: boolean;
    onChange: (checked: boolean) => void;
}

const Sjekkboks: FC<Props> = ({ label, checked, onChange }) => {
    return (
        <CheckboksPanel
            label={label}
            checked={checked || false}
            onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
        />
    );
};

export default Sjekkboks;
