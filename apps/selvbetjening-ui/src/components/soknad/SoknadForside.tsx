import React, { FC, useState } from "react";
import "./SoknadForside.less";
import { Panel } from "nav-frontend-paneler";
import { BekreftCheckboksPanel } from "nav-frontend-skjema";
import Lenke from "nav-frontend-lenker";
import { Normaltekst, Sidetittel, Undertittel } from "nav-frontend-typografi";
import { Hovedknapp } from "nav-frontend-knapper";
import Veileder from "nav-frontend-veileder";
import { useHistory } from "react-router-dom";
import ikon from "../../assets/veileder.svg";

const SoknadForside: FC = () => {
    const history = useHistory();

    const [harBekreftet, settBekreftet] = useState(false);

    return (
        <>
            <Panel className={"forside"}>
                <Veileder tekst="Hei, STERK GAPAHUK!" posisjon="høyre">
                    <img alt="veileder" src={ikon} />
                </Veileder>

                <br />

                <section>
                    <Sidetittel>Søknad om etterlatteytelser</Sidetittel>

                    <Normaltekst>
                        <p>
                            Dersom du grunnet dødsfall har blitt enslig mor eller far og har barn under 18 år, vil
                            etterlatteytelser sikre deg og dine barn inntekt. Inntekten din avgjør hvor mye du har krav
                            på.
                        </p>

                        <Lenke href={"#"}>Mer om etterlatteytelser</Lenke>
                    </Normaltekst>
                </section>

                <section>
                    <Undertittel>Det er viktig at du gir oss riktige opplysninger</Undertittel>

                    <Normaltekst>
                        <p>For at vi skal kunne behandle søknaden din, må du gi oss riktige opplysninger.</p>

                        <p>
                            Hvis du får etterlatteytelser, må du melde fra når det skjer viktige endringer i livet ditt,
                            for eksempel bo- og familiesituasjonen eller arbeid og utdanning. Det samme gjelder dersom
                            inntekten din endrer seg.
                        </p>
                    </Normaltekst>
                </section>

                <section>
                    <Undertittel>Det kan hende du må sende inn dokumentasjon</Undertittel>

                    <Normaltekst>
                        <p>
                            Du får beskjed underveis i søknaden hvis du må dokumentere noen av opplysningene dine.
                            Dokumentasjon du har sendt inn tidligere trenger du ikke sende på nytt.
                        </p>

                        <p>Noen ganger kan vi også trenge mer informasjon. Da gir vi deg beskjed om dette.</p>

                        <Lenke href={"#"}>Oversikt over hva som krever dokumentasjon</Lenke>
                    </Normaltekst>
                </section>

                <section>
                    <Undertittel>Slik søker du</Undertittel>

                    <Normaltekst>
                        <p>
                            I søknaden stiller vi kun spørsmål som er relevante i din situasjon. Antall spørsmål og
                            tiden det tar å søke vil derfor kunne variere. De fleste bruker 10 minutter.
                        </p>

                        <p>
                            Vi lagrer søknaden din ut morgendagen. Derfor kan du ta pauser når du fyller ut. Du kan også
                            slette i denne perioden.
                        </p>

                        <p>Mangler du dokumentasjon, kan du ettersende dette.</p>
                    </Normaltekst>
                </section>

                <section>
                    <Undertittel>Vi stoler på deg</Undertittel>

                    <BekreftCheckboksPanel
                        label="Ja, jeg samtykker"
                        checked={harBekreftet}
                        onChange={(e) => settBekreftet((e.target as HTMLInputElement).checked)}
                    >
                        <p>For å komme videre må du gi oss lov til å hente inn og bruke opplysninger om deg.</p>

                        <Lenke href="#">Les om hvilke opplysninger vi henter og hvordan vi bruker dem.</Lenke>
                    </BekreftCheckboksPanel>
                </section>

                {harBekreftet && <Hovedknapp onClick={() => history.push(`/soknad/steg/1`)}>Start søknad</Hovedknapp>}
            </Panel>
        </>
    );
};

export default SoknadForside;
