import "./BarnInfoKort.scss";
import { IBarn } from "../../../typer/person";
import ikon from "../../../assets/ikoner/barn1.svg";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { IValg } from "../../../typer/Spoersmaal";
import { BodyShort, Detail, Link, Title } from "@navikt/ds-react";

interface Props {
    barn: IBarn;
    index: number;
    fjern: (index: number) => void;
}

const BarnInfokort = memo(({ barn, index, fjern }: Props) => {
    const { t } = useTranslation();

    const foedselsnummer = barn.foedselsnummer?.replace(/(\d{6})(.*)/, "$1 $2");

    return (
        <div className={"infokort"}>
            <div className={"infokort__header"}>
                <img alt="barn" className="barneikon" src={ikon} />
            </div>

            <div className={"infokort__informasjonsboks center"}>
                <div className={"informasjonsboks-innhold"}>
                    <Title size={"s"}>
                        {barn.fornavn} {barn.etternavn}
                    </Title>
                </div>
                <div className="informasjonselement">
                    <BodyShort size={"s"} spacing>
                        {foedselsnummer}
                    </BodyShort>

                    <BodyShort size={"s"} spacing>
                        {t(`${barn.relasjon}`)}
                    </BodyShort>

                    <BodyShort size={"s"} spacing>
                        {barn.statsborgerskap} {t("omBarn.statsborger")}
                    </BodyShort>

                    <BodyShort size={"s"} spacing>
                        {t("omBarn.borI")}&nbsp;
                        {barn.bosattUtland?.svar === IValg.JA ? barn.bosattUtland?.land : t("felles.norge")}
                    </BodyShort>

                    <Detail size={"s"} spacing className={"mute"}>
                        {barn.barnepensjon?.soeker === IValg.JA && t("omBarn.barnepensjon.soekt")}
                    </Detail>
                </div>
            </div>

            <div className={"infokort__footer"}>
                <Link href={"#"} onClick={() => fjern(index)}>
                    {t("knapp.fjernFraSoeknad")}
                </Link>
            </div>
        </div>
    );
});

export default BarnInfokort;
