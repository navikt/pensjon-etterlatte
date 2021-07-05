import { RHFRadio } from "../../../felles/RHFRadio";
import { useFormContext } from "react-hook-form";
import { ISoeker } from "../../../../typer/person";
import GiftMedAvdoede from "./GiftMedAvdoede";
import SamboerMedAvdoede from "./SamboerMedAvdoede";
import SkiltFraAvdoede from "./SkiltFraAvdoede";
import TidligereSamboerMedAvdoede from "./TidligereSamboerMedAvdoede";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { SkjemaGruppe } from "nav-frontend-skjema";

enum ForholdTilAvdoede {
    gift = "gift",
    samboer = "samboer",
    skilt = "skilt",
    tidligereSamboer = "tidligereSamboer",
    ingen = "ingen"
}

const ForholdTilAvdoedeSkjema = () => {
    const { watch } = useFormContext<ISoeker>();

    const forholdTilAvdoede = watch("forholdTilAvdoede.forholdTilAvdoede");

    return (
        <>
            <RHFRadio
                name={"forholdTilAvdoede.forholdTilAvdoede"}
                legend={"Når dødsfallet skjedde var dere ..."}
                radios={[
                    {
                        label: "Gift",
                        value: ForholdTilAvdoede.gift
                    },
                    {
                        label: "Samboere",
                        value: ForholdTilAvdoede.samboer
                    },
                    {
                        label: "Skilt",
                        value: ForholdTilAvdoede.skilt
                    },
                    {
                        label: "Tidligere samboere",
                        value: ForholdTilAvdoede.tidligereSamboer
                    },
                    {
                        label: "Ingen av delene",
                        value: ForholdTilAvdoede.ingen
                    },
                ]}
            />

            {forholdTilAvdoede === ForholdTilAvdoede.gift && (
                <GiftMedAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.samboer && (
                <SamboerMedAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.skilt && (
                <SkiltFraAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.tidligereSamboer && (
                <TidligereSamboerMedAvdoede />
            )}

            {forholdTilAvdoede === ForholdTilAvdoede.ingen && (
                <SkjemaGruppe>
                    <AlertStripeAdvarsel>
                        Da ser det ikke ut som du har rett til ytelse
                    </AlertStripeAdvarsel>
                </SkjemaGruppe>
            )}
        </>
    )
};

export default ForholdTilAvdoedeSkjema;
