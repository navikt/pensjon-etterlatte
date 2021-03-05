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

const AndreYtelser: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 7 */}
            <Panel>
                <Systemtittel>7 Opplysninger om andre ytelser</Systemtittel>

                <SkjemaGruppe>
                    <RadioGruppe legend="Mottar du ytelser til livsopphold fra folketrygden som dagpenger under arbeidsledighet, sykepenger, stønad ved barns og andre nære pårørendes sykdom, arbeidsavklaringspenger, svangerskapspenger, foreldrepenger, AFP, uføretrygd eller alderspensjon?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>

                    <RadioGruppe legend="Har du satt fram krav om annen stønad/pensjon som ikke er avgjort?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    {/* TODO: Gjøre påbudt hvis JA */}
                    <Input label="Hvis ja, hva slags stønad/pensjon?" />

                    <RadioGruppe legend="Mottar du pensjon fra utlandet?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    {/* TODO: Gjøre påbudt hvis JA */}
                    <Input label="Hvis ja, hva slags pensjon og fra hvilket land?" />
                    <Input label="Bruttobeløp pr. år i landets valuta, oppgi landets valuta" />
                </SkjemaGruppe>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default AndreYtelser;
