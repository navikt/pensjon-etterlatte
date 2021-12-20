import { Language } from "../../hooks/useLanguage";
import "./Dropdown.scss";
import { Select, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

export const Dropdown = (props: { onChange: any; value: string }) => {
    const setLanguage = (e: any) => {
        props.onChange(e.target.value);
    };
    const { t } = useTranslation();

    return (
        <SkjemaGruppe className="dropdown_alt2">
            <Select onChange={setLanguage} value={props.value} label={t("felles.spraakValg")}>
                <option value={Language.NORSK_BOKMAAL}>Bokmål</option>
                <option value={Language.NORSK_NYNORSK}>Nynorsk</option>
                <option value={Language.ENGELSK}>English</option>
            </Select>
        </SkjemaGruppe>
    );
};
