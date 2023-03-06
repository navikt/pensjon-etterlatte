import { IBarn } from "../../../typer/person";
import ikon from "../../../assets/ikoner/barn1.svg";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { IValg } from "../../../typer/Spoersmaal";
import { BodyShort, Detail, Heading, BodyLong } from "@navikt/ds-react";
import { DeleteFilled, EditFilled } from "@navikt/ds-icons";
import {
    Infokort,
    InfokortFooter,
    InfokortFooterItem,
    InfokortHeader,
    InfokortInformasjonsboks, InfokortInformasjonsElement
} from "../../felles/StyledComponents";

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
        <Infokort>
            <InfokortHeader>
                <img alt="barn"  src={ikon}/>
            </InfokortHeader>

            <InfokortInformasjonsboks className={"center"}>
                <div className={"center"}>
                    <Heading size={"small"}>
                        {barn.fornavn} {barn.etternavn}
                    </Heading>
                </div>
                <InfokortInformasjonsElement>
                    <BodyShort size={"small"}>
                        {t("omBarn.infokort.foedselsnummer")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {foedselsnummer}
                    </BodyShort>

                    <BodyShort size={"small"}>
                        {t("omBarn.infokort.foreldre")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {t(`${barn.relasjon}`)}
                    </BodyShort>

                    <BodyShort size={"small"}>
                        {t("omBarn.infokort.statsborgerskap")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {barn.statsborgerskap}
                    </BodyShort>

                    <BodyShort size={"small"}>
                        {t("omBarn.infokort.bosted")}
                    </BodyShort>
                    <BodyShort size={"small"} spacing>
                        {t("omBarn.borI")}&nbsp;
                        {barn.bosattUtland?.svar === IValg.JA ? barn.bosattUtland?.land : t("felles.norge")}
                    </BodyShort>

                    <Detail size={"small"} spacing className={"mute"}>
                        {barn.barnepensjon?.soeker === IValg.JA && t("omBarn.barnepensjon.soekt")}
                    </Detail>
                </InfokortInformasjonsElement>
            </InfokortInformasjonsboks>

            <InfokortFooter>
                <BodyLong>
                    <InfokortFooterItem href={"#"} onClick={(e:Event) => {
                        e.preventDefault();
                        setAktivBarnIndex()
                    }}>
                        <EditFilled className={"edit-svg"}/>
                        <span>{t("knapp.endre")}</span>
                    </InfokortFooterItem>
                </BodyLong>
                <BodyLong>
                    <InfokortFooterItem href={"#"} onClick={() => fjern(index)}>
                        <DeleteFilled className={"edit-svg"}/>
                        <span>{t("knapp.fjernFraSoeknad")}</span>
                    </InfokortFooterItem>
                </BodyLong>

            </InfokortFooter>
        </Infokort>
    );
});

export default BarnInfokort;
