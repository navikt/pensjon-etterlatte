import React, { FC } from "react";
import "../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, Radio, RadioGruppe, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const OmDenAvdode: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 3 */}
            <Panel>
                <Systemtittel>3 Opplysninger om den avdøde</Systemtittel>
                <br />

                <SkjemaGruppe>
                    {/* 3.1 */}
                    <Input label="Fornavn" />
                    <Input label="Etternavn" />

                    {/* 3.2 */}
                    <Input label="Fødselsnummer (11 siffer)" />

                    {/* 
                    TODO: validering av fnr p
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <FnrInput
                            label="Fødselsnummer (11 siffer)"
                            bredde="S"
                            value={value}
                            onChange={(e) => handleChange(e)}
                            onValidate={(val) => setValid(val)}
                            feil={submit && !valid ? "Ugyldig fødselsnummer" : undefined}
                        />
                    </form> 
                    */}

                    {/* 3.3 */}
                    <Input label="Dødsdato (dd.mm.åå)" />

                    {/* 3.4 */}
                    <Input label="Statsborgerskap" />

                    {/* 3.5 fjernes. Ikke lenger gyldig. */}

                    <br />
                    <br />
                    {/* 3.6 */}
                    <RadioPanelGruppe
                        name="avdodBosetning"
                        legend="Var den avdøde bosatt i Norge sammenhengende siste tre år før dødsfallet?"
                        radios={[
                            { label: "Ja", value: "true", id: "juice1id" },
                            { label: "Nei", value: "false", id: "juice2id" },
                        ]}
                        checked="false"
                        onChange={function () {}}
                    />
                    <br />
                    {/* 3.6 */}
                    <RadioGruppe legend="Var den avdøde bosatt i Norge sammenhengende siste tre år før dødsfallet?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    <br />

                    {/* 3.7 */}
                    <RadioGruppe legend="Kan dødesfallet være en følge av yrkesskade/yrkessykdom?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    <br />

                    {/* 3.8 */}
                    <RadioGruppe legend="Hadde den avdøde bodd eller arbeidet i utlandet etter fylte 16 år?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}
                    <br />

                    {/* 3.10 */}
                    <RadioGruppe legend="Hadde den avdøde pensjonsgivende inntekt (arbeidsinntekt eller næringsinntekt) på tidspunktet før dødsfallet?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    <Input label="Hvis ja, bruttobeløp pr. år (kr)" />
                    <br />

                    {/* 3.11 Samme som over ?! */}

                    {/* 3.12 */}
                    <RadioGruppe legend="Mottok den avdøde pensjon fra andre land enn Norge?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    <Input label="Hvis ja, bruttobeløp pr. år (kr)" />
                    <br />

                    {/* 3.13 */}
                    <RadioGruppe legend="Har den avdøde etter 1966 avtjent militær eller sivil førstegangstjeneste som varte minst 30 dager?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>
                    <Input label="Hvis ja, oppgi årstall" />
                </SkjemaGruppe>
                <br />
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default OmDenAvdode;
