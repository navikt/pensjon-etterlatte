import React, { FC } from "react";
import "../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, Radio, RadioGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const NavaerendeArbeidsforhold: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 6 */}
            <Panel>
                <Systemtittel>6 Søkers nåværende arbeids- og inntektsforhold</Systemtittel>

                <SkjemaGruppe>
                    <Input label="Yrke/stilling" />
                    <Input label="Startdato (dd.mm.åå)" />
                    <Input label="Fremtidig sluttdato (dd.mm.åå)" />

                    <RadioGruppe legend="Oppgi type arbeidsforhold">
                        <Radio label={"Fast"} name="" />
                        <Radio label={"Midlertidig"} name="" />
                        <Radio label={"Sesongarbeid"} name="" />
                    </RadioGruppe>
                    <RadioGruppe>
                        <Radio label={"Deltid"} name="" />
                        <Radio label={"Heltid"} name="" />
                    </RadioGruppe>
                    <Input label="Hvis deltid, oppgi prosent" />

                    <Input label="Arbeidsgivers navn (Virksomhetens navn)" />
                    <Input label="Arbeidsgivers adresse (Virksomhetens adresse)" />

                    <Input label="Brutto arbeidsinntekt pr. måned" placeholder="Kr" />
                    <Input label="Beregnet personinntekt fra næring pr. år" placeholder="Kr" />
                </SkjemaGruppe>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default NavaerendeArbeidsforhold;
