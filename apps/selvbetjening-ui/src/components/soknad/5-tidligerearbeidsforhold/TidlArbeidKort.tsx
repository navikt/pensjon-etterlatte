import { Xknapp } from "nav-frontend-ikonknapper";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface KortProps {
    item: any;
    index: number;
    fjern: (index: number) => void;
}

const TidlArbeidKort = memo(({ item, index, fjern }: KortProps) => {
    const { t, i18n } = useTranslation();

    const dtf = Intl.DateTimeFormat(i18n.language, { month: "short", year: "numeric" });

    const fraDato = dtf.format(new Date(item.fraDato));
    const tilDato = dtf.format(new Date(item.tilDato));

    return (
        <div key={index} className={"infokort infokort__fullbredde"}>
            <div className={"infokort-knapper"}>
                {/* TODO: Lage støtte for å redigere elementer
                        <RedigerKnapp
                            title={"Rediger element"}
                            onClick={() => redigerElement(index)}
                        />
                */}
                <Xknapp title={t("knapp.fjernElement")} onClick={() => fjern(index)}/>
            </div>
            <div className={"infokort__informasjonsboks"}>
                <div className={"informasjonsboks-innhold"}>
                    <Undertittel tag="h3">{item.beskrivelse}</Undertittel>
                </div>
                <div className="informasjonselement">
                    <Normaltekst>
                        <span className={"capitalize"}>{fraDato}</span> -{" "}
                        <span className={"capitalize"}>{tilDato}</span>
                    </Normaltekst>
                </div>
            </div>
        </div>
    )
});

export default TidlArbeidKort;
