import Datovelger from "../../../felles/Datovelger";
import { RHFRadio, RHFToValgRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import SamboerSkjema from "./SamboerSkjema";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { ISoeker, OpploesningAarsak } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { SkjemaGruppe } from "nav-frontend-skjema";

const NyttSamboerskap = ({ gyldigVarighet }: { gyldigVarighet?: IValg }) => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const samboerskapOpploest = watch("nySivilstatus.samboerskapOpploest")
    const aarsakForOpploesningen = watch("nySivilstatus.aarsakForOpploesningen")
    const hattBarnEllerVaertGift = watch("samboer.hattBarnEllerVaertGift")

    return (
        <>
            <SkjemaGruppe>
                <Datovelger
                    name={"nySivilstatus.inngaatt.dato"}
                    label={"Dato for inngått samboerskap"}
                    maxDate={new Date()}
                />
            </SkjemaGruppe>

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
                        name={"nySivilstatus.samboerskapOpploest"}
                        legend={"Er dette samboerskapet oppløst?"}
                    />

                    {samboerskapOpploest === IValg.JA && (
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

            {aarsakForOpploesningen === OpploesningAarsak.samlivsbrudd && (
                <SkjemaGruppe>
                    <Datovelger
                        name={"nySivilstatus.opploestDato"}
                        label={"Dato for inngått samboerskap"}
                        maxDate={new Date()}
                    />
                </SkjemaGruppe>
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
