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

    return (
        <div className={"infokort"}>
            <div className={"infokort__header"}>
                <img alt="barn" className="barneikon" src={ikon} />
            </div>

            <div className={"infokort__informasjonsboks center"}>
                <div className={"informasjonsboks-innhold"}>
                    <Undertittel tag="h3">
                        {barn.fornavn} {barn.etternavn}
                    </Undertittel>
                </div>
                <div className="informasjonselement">
                    <Normaltekst>{barn.foedselsnummer}</Normaltekst>
                    <Normaltekst>{t(`${barn.relasjon}`)}</Normaltekst>
                    <Normaltekst>{barn.statsborgerskap} statsborger</Normaltekst>

                    {barn.bosattUtland?.svar === IValg.JA ? (
                        <Normaltekst>Bor i {barn.bosattUtland?.land}</Normaltekst>
                    ) : (
                        <Normaltekst>Bor i Norge</Normaltekst>
                    )}

                    <Undertekst className={"mute"}>{barn.soekerBarnepensjon === IValg.JA && "Søkt om barnepensjon"}</Undertekst>
                </div>
            </div>

            <div className={"infokort__footer"}>
                <Lenke href={"#"} onClick={() => fjern(index)}>
                    Fjern fra søknad
                </Lenke>
            </div>
        </div>
    );
});

export default BarnInfokort;
