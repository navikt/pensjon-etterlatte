import "./BarnInfoKort.scss";
import { IBarn } from "../../../typer/person";
import ikon from "../../../assets/ikoner/barn1.svg";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { IValg } from "../../../typer/Spoersmaal";
import { BodyShort, Detail, Link, Heading } from "@navikt/ds-react";

interface Props {
    barn: IBarn;
    index: number;
    fjern: (index: number) => void;
    setAktivBarnIndex: () => void
}

const BarnInfokort = memo(({ barn, index, fjern, setAktivBarnIndex }: Props) => {
    const { t } = useTranslation();

    const foedselsnummer = barn.foedselsnummer?.replace(/(\d{6})(.*)/, "$1 $2");

    return (
        <div className={"infokort"}>
            <div className={"infokort__header"}>
                <img alt="barn" className="barneikon" src={ikon} />
            </div>

            <div className={"infokort__informasjonsboks center"}>
                <div className={"informasjonsboks-innhold"}>
                    <Heading size={"small"}>
                        {barn.fornavn} {barn.etternavn}
                    </Heading>
                </div>
                <div className="informasjonselement">
                    <BodyShort size={"small"} >
                        {t("omBarn.infokort.foedselsnummer")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {foedselsnummer}
                    </BodyShort>

                    <BodyShort size={"small"} >
                        {t("omBarn.infokort.foreldre")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {t(`${barn.relasjon}`)}
                    </BodyShort>

                    <BodyShort size={"small"} >
                        {t("omBarn.infokort.statsborgerskap")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {barn.statsborgerskap}
                    </BodyShort>

                    <BodyShort size={"small"} >
                        {t("omBarn.infokort.bosted")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {t("omBarn.borI")}&nbsp;
                        {barn.bosattUtland?.svar === IValg.JA ? barn.bosattUtland?.land : t("felles.norge")}
                    </BodyShort>

                    <Detail size={"small"} spacing className={"mute"}>
                        {barn.barnepensjon?.soeker === IValg.JA && t("omBarn.barnepensjon.soekt")}
                    </Detail>
                </div>
            </div>

            <div className={"infokort__footer"}>
                <Link href={"#"} onClick={(e) => {e.preventDefault();  setAktivBarnIndex()} }>
                    {t("knapp.endre")}
                </Link>&nbsp;
                <Link href={"#"} onClick={() => fjern(index)}>
                    {t("knapp.fjernFraSoeknad")}
                </Link>
            </div>
        </div>
    );
});

export default BarnInfokort;
