import { IBarn } from "../../../typer/person";
import ikon from "../../../assets/ikoner/barn1.svg";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Xknapp } from "nav-frontend-ikonknapper";

interface Props {
    barn: IBarn;
    index: number;
    fjern: (index: number) => void;
}

const BarnInfokort = memo(({ barn, index, fjern }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={"infokort"}>
            <div className={"infokort__header"}>
                <img alt="barn" className="barneikon" src={ikon} />
            </div>
            <div className={"infokort-knapper"}>
                <Xknapp title={t("knapp.fjernElement")} onClick={() => fjern(index)}/>
            </div>
            <div className={"infokort__informasjonsboks"}>
                <div className={"informasjonsboks-innhold"}>
                    <Undertittel tag="h3">
                        {barn.fornavn} {barn.etternavn}
                    </Undertittel>
                </div>
                <div className="informasjonselement">
                    <Normaltekst>{barn.foedselsnummer}</Normaltekst>
                    <Normaltekst>{barn.foreldre}</Normaltekst>
                    <Normaltekst>
                        {t("opplysningerOmBarn.bosattUtland")}: {barn.bosattUtland}
                    </Normaltekst>
                </div>
            </div>
        </div>
    );
});

export default BarnInfokort;
