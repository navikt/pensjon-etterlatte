import React, { FC } from "react";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import { IValg } from "../../typer/ISpoersmaal";

interface Props {
    label: string;
    checked?: IValg;
    invert?: boolean; // Trigger på NEI i stedet
    onChange: (valgtSvar: IValg) => void;
    children?: React.ReactNode | React.ReactChild | React.ReactChildren;
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
                onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
            />
            {invert && checked === IValg.NEI && <>{children}</>}
            {!invert && checked === IValg.JA && <>{children}</>}
        </section>
    );
};

export default ToValgRadio;
