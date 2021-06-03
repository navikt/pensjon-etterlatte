import "../../../App.less";

import { SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import { IAndreYtelser } from "../../../typer/ytelser";

import SoknadSteg from "../../../typer/SoknadSteg";
import { RHFInput } from "../../felles/RHFInput";
import IValg from "../../../typer/IValg";
import Panel from "nav-frontend-paneler";
import Feilmeldinger from "../../felles/Feilmeldinger";

const AndreYtelser: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IAndreYtelser>({
        defaultValues: state.andreYtelser || {},
    });

    const {
        handleSubmit,
        watch,
        formState: { errors }
    } = methods;

    const lagre = (data: IAndreYtelser) => {
        dispatch({ type: ActionTypes.OPPDATER_ANDRE_YTELSER, payload: data });
        neste!!();
    };

    const kravOmAnnenStonad = watch("kravOmAnnenStonad.svar")
    const mottarPensjonUtland = watch("mottarPensjonUtland.svar")

    return (
        <FormProvider {...methods}>
            <form>
                {/* Steg 7 */}
                <Systemtittel className={"center"}>{t("andreYtelser.tittel")}</Systemtittel>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"mottarAndreYtelser"}
                        legend={t("andreYtelser.mottarAndreYtelser")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"kravOmAnnenStonad.svar"}
                        legend={t("andreYtelser.kravOmAnnenStonad")}
                    />

                    {kravOmAnnenStonad === IValg.JA && (
                        <RHFInput
                            name={"kravOmAnnenStonad.beskrivelseAvStoenad"}
                            label={t("andreYtelser.beskrivelseAvAnnenStoenad")}
                        />
                    )}
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"mottarPensjonUtland.svar"}
                        legend={t("andreYtelser.mottarPensjonUtland")}
                    />

                    {mottarPensjonUtland === IValg.JA && (
                        <Panel border>
                            <RHFInput
                                name={"mottarPensjonUtland.hvaSlagsPensjon"}
                                label={t("andreYtelser.hvaSlagsPensjon")}
                            />

                            <RHFInput
                                name={"mottarPensjonUtland.fraHvilketLand"}
                                label={t("andreYtelser.mottarFraLand")}
                            />

                            <RHFInput
                                name={"mottarPensjonUtland.bruttobeloepPrAar"}
                                label={t("andreYtelser.bruttobeloep")}
                            />

                            <RHFInput
                                name={"mottarPensjonUtland.landetsValuta"}
                                label={t("andreYtelser.landetsValuta")}
                            />
                        </Panel>
                    )}
                </SkjemaGruppe>

                <Feilmeldinger errors={errors} />

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Knapp htmlType={"button"} onClick={forrige}>
                        {t("knapp.tilbake")}
                    </Knapp>

                    <Hovedknapp htmlType={"button"} onClick={handleSubmit(lagre)}>
                        {t("knapp.tilOppsummering")}
                    </Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default AndreYtelser;
