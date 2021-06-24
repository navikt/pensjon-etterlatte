import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoeker } from "../../../../typer/person";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { hentAlder } from "../../../../utils/Utils";
import Datovelger from "../../../felles/Datovelger";
import NySivilstatus from "./nySivilstatus/NySivilstatus";
import { SkjemaGruppe } from "nav-frontend-skjema";

const SamboerMedAvdoede = () => {

    const { watch } = useFormContext<ISoeker>();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;
    const tidligereGift = watch("forholdTilAvdoede.tidligereGift");
    const omsorgForBarn = watch("forholdTilAvdoede.omsorgForBarn");

    let partnerskapMindreEnnFemAar = false;
    if (!!datoInngaattPartnerskap) {
        partnerskapMindreEnnFemAar = hentAlder(datoInngaattPartnerskap) < 5;
    }

    return (
        <>
            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={"Har/hadde dere felles barn?"}
            />

            {ingenFellesBarn && (
                <RHFToValgRadio
                    name={"forholdTilAvdoede.tidligereGift"}
                    legend={"Var du tidligere gift med avdøde?"}
                />
            )}

            {tidligereGift === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ikke rett
                </AlertStripeAdvarsel>
            )}

            {tidligereGift === IValg.JA && (
              <>
                  <Datovelger
                      name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                      label={"Dato for inngått samboerskap"}
                  />

                  {partnerskapMindreEnnFemAar && (
                      // TODO: Sjekke om denne kan ha lik tittel som tilsvarende element under GiftMedAvdoede.tsx
                      <RHFToValgRadio
                          name={"forholdTilAvdoede.omsorgForBarn"}
                          legend={"Hadde du omsorg for avdødes barn på dødstidspunktet?"}
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

            <NySivilstatus />
        </>
    )
}

export default SamboerMedAvdoede;
