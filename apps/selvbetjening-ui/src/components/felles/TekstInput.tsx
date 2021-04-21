import { Input } from "nav-frontend-skjema";
import React, { ChangeEvent, FC } from "react";

interface Props {
    value?: string;
    placeholder?: string;
    label: string;
    onChange: (value: string) => void;
}

const TekstInput: FC<Props> = ({ value, placeholder, label, onChange }) => {
    return (
        <Input
            value={value || ""}
            placeholder={placeholder}
            label={label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
    );
};

export default TekstInput;
