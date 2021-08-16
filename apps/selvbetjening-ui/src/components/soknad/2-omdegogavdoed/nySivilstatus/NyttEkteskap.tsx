import Datovelger from "../../../felles/Datovelger";
import { RHFRadio, RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { useTranslation } from "react-i18next";
import { ISoeker, OpploesningAarsak } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { RadioProps } from "nav-frontend-skjema";
import { nySivilstatusHarGyldigVarighet } from "../../../../utils/dato";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";

const NyttEkteskap = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const fremdelesGift = watch("nySivilstatus.ekteskap.fremdelesGift")
    const aarsakForOpploesningen = watch("nySivilstatus.ekteskap.aarsakForOpploesningen")

    const inngaattDato = watch("nySivilstatus.ekteskap.inngaattDato")
    const opploestDato = watch("nySivilstatus.ekteskap.opploestDato")

    let gyldigVarighet = nySivilstatusHarGyldigVarighet(inngaattDato, opploestDato);

    return (
        <>
            <RHFSpoersmaalRadio
                name={"nySivilstatus.ekteskap.fremdelesGift"}
                legend={t("omDegOgAvdoed.nySivilstatus.ekteskap.fremdelesGift")}
            />

            {fremdelesGift === IValg.NEI && (
                <>
                    <RHFRadio
                        name={"nySivilstatus.ekteskap.aarsakForOpploesningen"}
                        legend={t("omDegOgAvdoed.nySivilstatus.ekteskap.aarsakForOpploesningen")}
                        description={
                            <HvorforSpoerVi>
                                {t("omDegOgAvdoed.nySivilstatus.ekteskap.hvorforAarsakOpploesning")}
                            </HvorforSpoerVi>
                        }
                        radios={[
                            {
                                label: t(OpploesningAarsak.doedsfall),
                                value: OpploesningAarsak.doedsfall
                            },
                            {
                                label: t(OpploesningAarsak.skilsmisse),
                                value: OpploesningAarsak.skilsmisse
                            }
                        ] as RadioProps[]}
                    />
                </>
            )}

            {aarsakForOpploesningen === OpploesningAarsak.skilsmisse && (
                <div className={"rad"}>
                    <div className={"kolonne"}>
                        <Datovelger
                            name={"nySivilstatus.ekteskap.inngaattDato"}
                            label={t("omDegOgAvdoed.nySivilstatus.ekteskap.inngaattDato")}
                        />
                    </div>
                    <div className={"kolonne"}>
                        <Datovelger
                            name={"nySivilstatus.ekteskap.opploestDato"}
                            label={t("omDegOgAvdoed.nySivilstatus.ekteskap.opploestDato")}
                        />
                    </div>
                </div>
            )}

            {gyldigVarighet === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ikke rett!
                </AlertStripeAdvarsel>
            )}
        </>
    )
};

export default NyttEkteskap;
