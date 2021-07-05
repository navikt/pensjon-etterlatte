import Datovelger from "../../../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../../../felles/RHFRadio";
import { IValg } from "../../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { useTranslation } from "react-i18next";
import { ISoeker, OpploesningAarsak } from "../../../../../typer/person";
import { useFormContext } from "react-hook-form";

const NyttEkteskap = ({ gyldigVarighet }: { gyldigVarighet?: IValg }) => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const fremdelesGift = watch("nySivilstatus.fremdelesGift")
    const aarsakForOpploesningen = watch("nySivilstatus.aarsakForOpploesningen")

    return (
        <>
            <RHFToValgRadio
                name={"nySivilstatus.fremdelesGift"}
                legend={"Er dere fremdeles gift?"}
            />

            {fremdelesGift === IValg.NEI && (
                <>
                    <RHFRadio
                        name={"nySivilstatus.aarsakForOpploesningen"}
                        legend={t("omSoekeren.aarsakOpploesning.tittel")}
                        radios={[
                            {
                                label: t("omSoekeren.aarsakOpploesning.dødsfall"),
                                value: OpploesningAarsak.doedsfall
                            },
                            {
                                label: t("omSoekeren.aarsakOpploesning.skilsmisse"),
                                value: OpploesningAarsak.skilsmisse
                            }
                        ]}
                    />
                </>
            )}

            {aarsakForOpploesningen === OpploesningAarsak.skilsmisse && (
                <div className={"rad"}>
                    <div className={"kolonne"}>
                        <Datovelger
                            name={"nySivilstatus.inngaatt.dato"}
                            label={"Vi giftet oss"}
                        />
                    </div>
                    <div className={"kolonne"}>
                        <Datovelger
                            name={"nySivilstatus.opploest.dato"}
                            label={"Vi ble skilt"}
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
