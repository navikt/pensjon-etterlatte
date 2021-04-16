import React, { FC } from "react";
import "./SoknadForside.less";
import { Panel } from "nav-frontend-paneler";
import Lenke from "nav-frontend-lenker";
import { Normaltekst, Sidetittel } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";

const SoknadSendt: FC = () => {
    return (
        <>
            <Panel className={"forside"}>
                <Veileder tekst="Søknaden er sendt!" posisjon="høyre">
                    <img alt="veileder" src={ikon} />
                </Veileder>

                <br />
                <br />

                <section>
                    <Sidetittel>Takk for din søknad!</Sidetittel>

                    <Normaltekst>
                        <p>Din søknad er nå sendt og vil bli behandlet ila. 2-3 uker.</p>

                        <Lenke href={"#"}>Les mer om behandling av søknad her.</Lenke>
                    </Normaltekst>
                </section>

                <br />
                <br />
                <br />

                <section className={"navigasjon-rad"}>
                    <Knapp
                        onClick={() => {
                            window.location.href = "https://www.nav.no";
                        }}
                    >
                        Avslutt
                    </Knapp>
                </section>
            </Panel>
        </>
    );
};

export default SoknadSendt;
