import React, { FC } from "react";
import { RadioPanelGruppe } from "nav-frontend-skjema";

interface Props {
    label: string;
    checked?: string;
    invert?: boolean; // Trigger på NEI i stedet
    onChange: (valgtSvar: string) => void;
    children?: React.ReactNode | React.ReactChild | React.ReactChildren;
}

enum IValg {
    JA = "Ja",
    NEI = "Nei",
}

const ToValgRadio: FC<Props> = ({ label, checked, invert, onChange, children }) => {
    return (
        <section>
            <RadioPanelGruppe
                name={""}
                legend={label}
                className={"to-valg-radio"}
                radios={[
                    { label: IValg.JA, value: IValg.JA },
                    { label: IValg.NEI, value: IValg.NEI },
                ]}
                checked={checked}
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
            />
            {invert && checked === IValg.NEI && <>{children}</>}
            {!invert && checked === IValg.JA && <>{children}</>}
        </section>
    );
};

export default ToValgRadio;
