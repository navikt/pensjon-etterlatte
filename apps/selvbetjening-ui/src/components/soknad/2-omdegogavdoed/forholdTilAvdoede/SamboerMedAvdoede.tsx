import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { hentAlder } from "../../../../utils/dato";
import Datovelger from "../../../felles/Datovelger";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const SamboerMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;
    const tidligereGift = watch("forholdTilAvdoede.tidligereGift");
    const omsorgForBarn = watch("forholdTilAvdoede.omsorgForBarn");

    let partnerskapMindreEnnFemAar = !!datoInngaattPartnerskap ? hentAlder(datoInngaattPartnerskap) < 5 : false;

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
                    <AlertStripeAdvarsel>
                        {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                    </AlertStripeAdvarsel>
                </SkjemaGruppe>
            )}

            {tidligereGift === IValg.JA && (
              <>
                  <SkjemaGruppe>
                      <Datovelger
                          name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                          label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap")}
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
                          <AlertStripeAdvarsel>
                              {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                          </AlertStripeAdvarsel>
                      </SkjemaGruppe>
                  )}
              </>
            )}
        </>
    )
};

export default SamboerMedAvdoede;
