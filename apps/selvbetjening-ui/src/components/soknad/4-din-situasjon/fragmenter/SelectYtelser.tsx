import { Ytelser } from "../../../../typer/ytelser";
import { useTranslation } from "react-i18next";
import { RHFSelect } from "../../../felles/RHFSelect";


const SelectYtelser = () => {
    const { t } = useTranslation();

    const liste =
        [
            { label: t("felles.velg"), value: '' },
            {
                label: t("ytelser.dagpenger"),
                value: Ytelser.dagpenger,
            },
            {
                label: t("ytelser.sykepenger"),
                value: Ytelser.sykepenger,
            },
            {
                label: t("ytelser.pleiepenger"),
                value: Ytelser.pleiepenger,
            },
            {
                label: t("ytelser.svangerskapspenger"),
                value: Ytelser.svangerskapspenger,
            },
            {
                label: t("ytelser.foreldrepenger"),
                value: Ytelser.foreldrepenger,
            },
            {
                label: t("ytelser.arbeidsavklaringspenger"),
                value: Ytelser.arbeidsavklaringspenger,
            },
            {
                label: t("ytelser.kvalifiseringsstoenad"),
                value: Ytelser.kvalifiseringsstoenad,
            },
            {
                label: t("ytelser.kommunal"),
                value: Ytelser.kommunal,
            },
            {
                label: t("ytelser.fosterhjem"),
                value: Ytelser.fosterhjem,
            },
            {
                label: t("ytelser.omsorgspenger"),
                value: Ytelser.omsorgspenger,
            },
            {
                label: t("ytelser.opplaeringspenger"),
                value: Ytelser.opplaeringspenger,
            },
        ]

    return (
        <RHFSelect
            name={"andreYtelser.kravOmAnnenStonad.ytelser"}
            label={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.ytelser")}
            selectOptions={liste}
        />
    )
}

export default SelectYtelser;
