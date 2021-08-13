import React, { useState } from "react";
import "../../felles/Infokort.less";
import ikon from "../../../assets/ikoner/barn1.svg";
import { Systemtittel } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { default as Modal } from "nav-frontend-modal";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn, IOmBarn } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import BarnInfokort from "./BarnInfokort";
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { v4 as uuid } from "uuid";
import Navigasjon from "../../felles/Navigasjon";
import AlertStripe from "nav-frontend-alertstriper";
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import { RHFInput } from "../../felles/RHFInput";
import { IValg } from "../../../typer/Spoersmaal";

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

    const { handleSubmit, watch } = methods;

    const gravidEllerNyligFoedt = watch("gravidEllerNyligFoedt.svar")

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Systemtittel className={"center"}>
                        {t("omBarn.tittel")}
                    </Systemtittel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <AlertStripe type={"info"} form={"inline"}>
                        Her kan du legge inn informasjon om alle barn uansett alder:
                        <ul>
                            <li>Felles barn med avdøde</li>
                            <li>Avdødes særkullsbarn</li>
                            <li>Egne særkullsbarn</li>
                        </ul>

                        Felles barn med avdøde under 18 år kan ha rett på barnepensjon.
                    </AlertStripe>
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

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"gravidEllerNyligFoedt.svar"}
                        legend={t("omBarn.gravidEllerNyligFoedt.svar")}
                    />

                    {gravidEllerNyligFoedt === IValg.JA && (
                        <RHFInput
                            name={"gravidEllerNyligFoedt.beskrivelse"}
                            label={t("omBarn.gravidEllerNyligFoedt.beskrivelse")}
                            placeholder={t("omBarn.gravidEllerNyligFoedt.placeholder")}
                        />
                    )}
                </SkjemaGruppe>

                <Navigasjon
                    forrige={{ onClick: forrige }}
                    neste={{
                        onClick: handleSubmit(lagre),
                        label: !fields.length ? t("knapp.hoppOver") : undefined
                    }}
                />
            </form>
        </FormProvider>
    );
};

export default OpplysningerOmBarn;
