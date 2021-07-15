import Datovelger from "../../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { useTranslation } from "react-i18next";
import { ISoeker, OpploesningAarsak } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { RadioProps } from "nav-frontend-skjema";

const NyttEkteskap = ({ gyldigVarighet }: { gyldigVarighet?: IValg }) => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const fremdelesGift = watch("nySivilstatus.fremdelesGift")
    const aarsakForOpploesningen = watch("nySivilstatus.aarsakForOpploesningen")

    return (
        <>
            <RHFToValgRadio
                name={"nySivilstatus.fremdelesGift"}
                legend={t("omDegOgAvdoed.nySivilstatus.fremdelesGift")}
            />

            {fremdelesGift === IValg.NEI && (
                <>
                    <RHFRadio
                        name={"nySivilstatus.aarsakForOpploesningen"}
                        legend={t("omDegOgAvdoed.nySivilstatus.aarsakForOpploesningen")}
                        hjelpetekst={t("omDegOgAvdoed.nySivilstatus.hvorforAarsakOpploesning")}
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
                            name={"nySivilstatus.inngaatt.dato"}
                            label={t("omDegOgAvdoed.nySivilstatus.inngaatt.dato")}
                        />
                    </div>
                    <div className={"kolonne"}>
                        <Datovelger
                            name={"nySivilstatus.opploest.dato"}
                            label={t("omDegOgAvdoed.nySivilstatus.opploest.dato")}
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
