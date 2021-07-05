import Datovelger from "../../../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../../../felles/RHFRadio";
import { IValg } from "../../../../../typer/Spoersmaal";
import SamboerSkjema from "./SamboerSkjema";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { ISoeker, OpploesningAarsak } from "../../../../../typer/person";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

const NyttSamboerskap = ({ gyldigVarighet }: { gyldigVarighet?: IValg }) => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const fremdelesGift = watch("nySivilstatus.fremdelesGift")
    const hattBarnEllerVaertGift = watch("samboer.hattBarnEllerVaertGift")

    return (
        <>
            <Datovelger
                name={"nySivilstatus.inngaatt.dato"}
                label={"Dato for inngått samboerskap"}
            />

            <RHFToValgRadio
                name={"samboer.hattBarnEllerVaertGift"}
                legend={"Har/hadde dere barn sammen eller var dere tidligere gift?"}
            />

            {hattBarnEllerVaertGift === IValg.NEI && (
                <SamboerSkjema/>
            )}

            {hattBarnEllerVaertGift === IValg.JA && (
                <>
                    <RHFToValgRadio
                        name={"nySivilstatus.fremdelesGift"}
                        legend={"Er dette samboerskapet oppløst?"}
                    />

                    {fremdelesGift === IValg.NEI && (
                        <RHFRadio
                            name={"nySivilstatus.aarsakForOpploesningen"}
                            legend={t("omSoekeren.aarsakOpploesning.tittel")}
                            radios={[
                                {
                                    label: t("omSoekeren.aarsakOpploesning.dødsfall"),
                                    value: OpploesningAarsak.doedsfall
                                },
                                {
                                    label: t("omSoekeren.aarsakOpploesning.samlivsbrudd"),
                                    value: OpploesningAarsak.samlivsbrudd
                                },
                            ]}
                        />
                    )}
                </>
            )}

            {gyldigVarighet === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ikke rett
                </AlertStripeAdvarsel>
            )}
        </>
    )
};

export default NyttSamboerskap;
