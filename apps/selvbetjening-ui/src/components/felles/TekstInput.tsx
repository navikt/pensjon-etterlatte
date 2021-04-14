import { Input } from "nav-frontend-skjema";
import React, { ChangeEvent, FC } from "react";

interface Props {
    value?: string;
    label: string;
    onChange: (value: string) => void;
}

const TekstInput: FC<Props> = ({ value, label, onChange }) => {
    return (
        <Input value={value} label={label} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
    );
};

export default TekstInput;
