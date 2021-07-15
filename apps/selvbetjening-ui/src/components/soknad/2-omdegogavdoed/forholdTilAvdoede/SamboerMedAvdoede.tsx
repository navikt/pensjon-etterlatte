import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
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
            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {ingenFellesBarn && (
                <RHFToValgRadio
                    name={"forholdTilAvdoede.tidligereGift"}
                    legend={t("omDegOgAvdoed.forholdTilAvdoede.tidligereGift")}
                />
            )}

            {tidligereGift === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ikke rett
                </AlertStripeAdvarsel>
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
                      <RHFToValgRadio
                          name={"forholdTilAvdoede.omsorgForBarn"}
                          legend={t("omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn")}
                      />
                  )}

                  {/* TODO: Tekster må ferdigstilles */}
                  {omsorgForBarn === IValg.NEI && (
                      <SkjemaGruppe>
                          <AlertStripeAdvarsel>
                              Ingen rett på overgangsstønad...
                              Oppgi beløp pr. år... skal dette være et felt som må fylles ut?
                          </AlertStripeAdvarsel>
                      </SkjemaGruppe>
                  )}
              </>
            )}
        </>
    )
};

export default SamboerMedAvdoede;
