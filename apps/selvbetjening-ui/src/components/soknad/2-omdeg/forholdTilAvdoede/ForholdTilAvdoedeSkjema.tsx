import { RHFRadio } from "../../../felles/RHFRadio";
import { useFormContext } from "react-hook-form";
import { ISoeker } from "../../../../typer/person";
import GiftMedAvdoede from "./GiftMedAvdoede";
import SamboerMedAvdoede from "./SamboerMedAvdoede";
import SkiltFraAvdoede from "./SkiltFraAvdoede";
import TidligereSamboerMedAvdoede from "./TidligereSamboerMedAvdoede";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";

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
                legend={"Hva var ditt forhold til avdøde på dødstidspunktet?"}
                radios={[
                    {
                        label: "Jeg var gift med avdøde",
                        value: ForholdTilAvdoede.gift
                    },
                    {
                        label: "Jeg var samboer med avdøde",
                        value: ForholdTilAvdoede.samboer
                    },
                    {
                        label: "Jeg var skilt fra avdøde",
                        value: ForholdTilAvdoede.skilt
                    },
                    {
                        label: "Jeg var tidligere samboer med avdøde",
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
                <AlertStripeAdvarsel>
                    Da ser det ikke ut som du har rett til ytelse
                </AlertStripeAdvarsel>
            )}
        </>
    )
};

export default ForholdTilAvdoedeSkjema;
