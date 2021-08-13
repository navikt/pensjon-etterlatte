import React, { useState } from "react";
import "../../felles/Infokort.less";
import ikon from "../../../assets/ikoner/barn1.svg";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { GravidEllerNyligFoedt, IBarn, IOmBarn } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import BarnInfokort from "./BarnInfokort";
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { v4 as uuid } from "uuid";
import Navigasjon from "../../felles/Navigasjon";
import AlertStripe from "nav-frontend-alertstriper";
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RHFRadio } from "../../felles/RHFRadio";
import Panel from "nav-frontend-paneler";

Modal.setAppElement("#root");

const OpplysningerOmBarn: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IOmBarn>({
        defaultValues: state.opplysningerOmBarn || {},
        shouldUnregister: true
    });

    const { fields, append, remove } = useFieldArray({
        name: "barn",
        control: methods.control
    });

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const leggTilBarn = (data: IBarn) => {
        append(data as any)
        setIsOpen(false);
    };

    const lagre = (data: IOmBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: data });
        neste!!();
    }

    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Systemtittel className={"center"}>
                        {t("omBarn.tittel")}
                    </Systemtittel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Panel border>
                        <AlertStripe type={"info"} form={"inline"}>
                            <Normaltekst>
                                Dersom du har eller har hatt barn er det viktig at du legger de til – uavhengig av alder –
                                da dette kan påvirke din rett til gjenlevendepensjon. Dette gjelder felles barn med avdøde, avdødes særkullsbarn, og egne særkullsbarn.
                            </Normaltekst>
                            <br/>
                            <Normaltekst>
                                Felles barn med avdøde under 18 år kan ha rett på barnepensjon.
                            </Normaltekst>
                        </AlertStripe>
                    </Panel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <div className={"infokort-wrapper"}>
                        {fields?.map((field: FieldArrayWithId, index: number) => (
                            <BarnInfokort
                                key={uuid()}
                                barn={field as IBarn}
                                index={index}
                                fjern={remove}
                            />
                        ))}

                        <div className={"infokort"}>
                            <div className={"infokort__header gjennomsiktig"}>
                                <img alt="barn" className="barneikon" src={ikon} />
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Knapp htmlType={"button"} onClick={() => setIsOpen(true)}>
                                        {t("knapp.leggTilBarn")}
                                    </Knapp>
                                </div>

                                <Normaltekst className={"center mute"}>
                                    Dette er valgfritt
                                </Normaltekst>
                            </div>
                        </div>
                    </div>

                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        closeButton={true}
                        contentLabel={t("omBarn.tittel")}
                    >
                        <LeggTilBarnSkjema lagre={leggTilBarn} />
                    </Modal>
                </SkjemaGruppe>

                <RHFRadio
                    name={"gravidEllerNyligFoedt"}
                    legend={t("omBarn.gravidEllerNyligFoedt")}
                    radios={Object.values(GravidEllerNyligFoedt).map(value => {
                        return { label: t(value), value } as RadioProps
                    })}
                />

                <Navigasjon
                    forrige={{ onClick: forrige }}
                    neste={{ onClick: handleSubmit(lagre) }}
                />
            </form>
        </FormProvider>
    );
};

export default OpplysningerOmBarn;
