import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { Alert } from "@navikt/ds-react";
import { hentAlder } from "../../../../utils/dato";
import Datovelger from "../../../felles/Datovelger";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const SamboerMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap");
    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;
    const tidligereGift = watch("forholdTilAvdoede.tidligereGift");
    const omsorgForBarn = watch("forholdTilAvdoede.omsorgForBarn");
    const datoforDoedsfallet = watch("avdoed.datoForDoedsfallet");

    const partnerskapMindreEnnFemAar = !!datoInngaattPartnerskap ? hentAlder(datoInngaattPartnerskap) < 5 : false;

    return (
        <>
            <RHFSpoersmaalRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {ingenFellesBarn && (
                <RHFSpoersmaalRadio
                    name={"forholdTilAvdoede.tidligereGift"}
                    legend={t("omDegOgAvdoed.forholdTilAvdoede.tidligereGift")}
                />
            )}

            {tidligereGift === IValg.NEI && (
                <SkjemaGruppe>
                    <Alert variant={"warning"}>{t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}</Alert>
                </SkjemaGruppe>
            )}

            {tidligereGift === IValg.JA && (
                <>
                    <SkjemaGruppe>
                        <Datovelger
                            name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                            label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap")}
                            maxDate={datoforDoedsfallet || new Date()}
                        />
                    </SkjemaGruppe>

                    {partnerskapMindreEnnFemAar && (
                        // TODO: Sjekke om denne kan ha lik tittel som tilsvarende element under GiftMedAvdoede.tsx
                        <RHFSpoersmaalRadio
                            name={"forholdTilAvdoede.omsorgForBarn"}
                            legend={t("omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn")}
                        />
                    )}

                    {omsorgForBarn === IValg.NEI && (
                        <SkjemaGruppe>
                            <Alert variant={"warning"}>
                                {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                            </Alert>
                        </SkjemaGruppe>
                    )}
                </>
            )}
        </>
    );
};

export default SamboerMedAvdoede;
