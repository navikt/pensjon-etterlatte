import { Language } from "../../hooks/useLanguage";
import "./Dropdown.scss";
import { Select, SkjemaGruppe } from "nav-frontend-skjema";

export const Dropdown = (props: { onChange: any; value: string }) => {
    const setLanguage = (e: any) => {
        props.onChange(e.target.value);
    };

    return (
        <SkjemaGruppe className="dropdown_alt2">
            <Select onChange={setLanguage} value={props.value} label="Velg språk">
                <option value={Language.NORSK_BOKMAAL}>Bokmål</option>
                <option value={Language.NORSK_NYNORSK}>Nynorsk</option>
                <option value={Language.ENGELSK}>English</option>
            </Select>
        </SkjemaGruppe>
    );
};
