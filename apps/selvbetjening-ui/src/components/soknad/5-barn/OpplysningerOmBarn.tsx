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
import { Alert } from "@navikt/ds-react";
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RHFRadio } from "../../felles/RHFRadio";
import Panel from "nav-frontend-paneler";
import { useEffectOnce } from "../../../utils/extensions";
import { isEmpty } from "lodash";

Modal.setAppElement("#root");

const OpplysningerOmBarn: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IOmBarn>({
        defaultValues: state.opplysningerOmBarn || {}
    });

    useEffectOnce(() => {
        methods.reset(state.opplysningerOmBarn)
    }, !isEmpty(state.opplysningerOmBarn));

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
                        <Alert variant={"info"} className={"navds-alert--inline"}>
                            <Normaltekst>
                                {t("omBarn.informasjon")}
                            </Normaltekst>
                        </Alert>
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
                                    {t("omBarn.valgfritt")}
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
