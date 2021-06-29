import Datovelger from "../../../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../../../felles/RHFRadio";
import { IValg } from "../../../../../typer/Spoersmaal";
import SamboerSkjema from "./SamboerSkjema";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { OpploesningAarsak } from "../../../../../typer/person";
import { useTranslation } from "react-i18next";

interface Props {
    hattBarnEllerVaertGift?: IValg;
    gyldigVarighet?: IValg;
    opploest?: IValg;
}

const NyttSamboerskap = ({ hattBarnEllerVaertGift, gyldigVarighet, opploest }: Props) => {
    const { t } = useTranslation();

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
                        name={"nySivilstatus.opploest.svar"}
                        legend={"Er dette samboerskapet oppløst?"}
                    />

                    {opploest === IValg.JA && (
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
