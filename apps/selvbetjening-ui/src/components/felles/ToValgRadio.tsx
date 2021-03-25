import React, { FC } from "react";
import { RadioPanelGruppe } from "nav-frontend-skjema";

interface Props {
    legend: string;
    checked: string;
    onChange: (valgtSvar: string) => void;
    children?: React.ReactNode | React.ReactChild | React.ReactChildren;
}

enum IValg {
    JA = "Ja",
    NEI = "Nei",
}

const ToValgRadio: FC<Props> = ({ legend, checked, onChange, children }) => {
    return (
        <>
            <RadioPanelGruppe
                name={""}
                legend={legend}
                className={"to-valg-radio"}
                radios={[
                    { label: IValg.JA, value: IValg.JA },
                    { label: IValg.NEI, value: IValg.NEI },
                ]}
                checked={checked}
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
            />
            {checked === IValg.JA && <>{children}</>}
        </>
    );
};

export default ToValgRadio;
