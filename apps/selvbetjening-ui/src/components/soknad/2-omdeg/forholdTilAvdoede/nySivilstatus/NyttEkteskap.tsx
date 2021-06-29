import Datovelger from "../../../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../../../felles/RHFRadio";
import { IValg } from "../../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { useTranslation } from "react-i18next";
import { OpploesningAarsak } from "../../../../../typer/person";

interface Props {
    opploest?: IValg;
    gyldigVarighet?: IValg;
}

const NyttEkteskap = ({ opploest, gyldigVarighet }: Props) => {
    const { t } = useTranslation();

    return (
        <>
            <Datovelger
                name={"nySivilstatus.inngaatt.dato"}
                label={"Dato for inngått ekteskap/partnerskap"}
            />

            <RHFToValgRadio
                name={"nySivilstatus.opploest.svar"}
                legend={"Er dette ekteskapet oppløst?"}
            />

            {opploest === IValg.JA && (
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

                    <Datovelger
                        name={"nySivilstatus.opploest.dato"}
                        label={"Dato for skilsmisse"}
                    />
                </>
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
