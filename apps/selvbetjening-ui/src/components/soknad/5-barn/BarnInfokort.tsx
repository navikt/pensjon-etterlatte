import { IBarn } from "../../../typer/person";
import ikon from "../../../assets/ikoner/barn1.svg";
import { Normaltekst, Undertekst, Undertittel } from "nav-frontend-typografi";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { IValg } from "../../../typer/Spoersmaal";
import Lenke from "nav-frontend-lenker";

interface Props {
    barn: IBarn;
    index: number;
    fjern: (index: number) => void;
}

const BarnInfokort = memo(({ barn, index, fjern }: Props) => {
    const { t } = useTranslation();

    const foedselsnummer = barn.foedselsnummer?.replace(/(\d{6})(.*)/, "$1 $2")

    return (
        <div className={"infokort"}>
            <div className={"infokort__header"}>
                <img alt="barn" className="barneikon" src={ikon}/>
            </div>

            <div className={"infokort__informasjonsboks center"}>
                <div className={"informasjonsboks-innhold"}>
                    <Undertittel tag="h3">
                        {barn.fornavn} {barn.etternavn}
                    </Undertittel>
                </div>
                <div className="informasjonselement">
                    <Normaltekst>{foedselsnummer}</Normaltekst>
                    <Normaltekst>{t(`${barn.relasjon}`)}</Normaltekst>
                    <Normaltekst>{barn.statsborgerskap} {t("omBarn.statsborger")}</Normaltekst>

                    <Normaltekst>
                        {t("omBarn.borI")}&nbsp;
                        {barn.bosattUtland?.svar === IValg.JA ? barn.bosattUtland?.land : t("felles.norge")}
                    </Normaltekst>

                    <Undertekst className={"mute"}>
                        {barn.soekerBarnepensjon === IValg.JA && t("omBarn.soektOmBarnepensjon")}
                    </Undertekst>
                </div>
            </div>

            <div className={"infokort__footer"}>
                <Lenke href={"#"} onClick={() => fjern(index)}>
                    {t("knapp.fjernFraSoeknad")}
                </Lenke>
            </div>
        </div>
    );
});

export default BarnInfokort;
