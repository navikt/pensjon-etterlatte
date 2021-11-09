import React, { useState } from "react";
import "../../felles/Infokort.scss";
import ikon from "../../../assets/ikoner/barn1.svg";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn, IOmBarn } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import BarnInfokort from "./BarnInfokort";
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { v4 as uuid } from "uuid";
import Navigasjon from "../../felles/Navigasjon";
import { Alert, BodyShort, Button, Modal, Panel, Heading, Accordion } from "@navikt/ds-react";
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { deepCopy } from "../../../utils/deepCopy";
import { AccordionItem } from "../6-oppsummering/AccordionItem";

if (process.env.NODE_ENV !== "test") Modal.setAppElement!!("#root"); //Denne er også definert i Navigasjon. Trenger vi den?

const OpplysningerOmBarn: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IOmBarn>({
        defaultValues: state.opplysningerOmBarn || {},
    });

    const {
        watch,
        getValues
    } = methods;

    const erValidert = watch("erValidert")
    const registrerteBarn = watch("barn")

    const getFnrRegistrerteBarn = (): string[] => {
        if (registrerteBarn !== undefined) {
            return registrerteBarn.map(barn => barn.foedselsnummer !== undefined ? barn.foedselsnummer : "")
        } else {
            return []
        }
    }
    const fnrRegistrerteBarn: string[] = getFnrRegistrerteBarn()

    const { fields, append, remove } = useFieldArray({
        name: "barn",
        control: methods.control,
    });

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const leggTilBarn = (data: IBarn) => {
        append(data as any);
        setIsOpen(false);
    };

    const lagreNeste = (data: IOmBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(data), erValidert: true } });
        neste!!();
    };

    const lagreTilbake = (data: IOmBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Heading size={"medium"} className={"center"}>
                        {t("omBarn.tittel")}
                    </Heading>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Panel border>
                        <Alert variant={"info"} className={"navds-alert--inline"}>
                            <BodyShort size={"small"}>{t("omBarn.informasjon")}</BodyShort>
                        </Alert>
                    </Panel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <div className={"infokort-wrapper"}>
                        {fields?.map((field: FieldArrayWithId, index: number) => (
                            <BarnInfokort key={uuid()} barn={field as IBarn} index={index} fjern={remove}/>
                        ))}

                        <div className={"infokort"}>
                            <div className={"infokort__header gjennomsiktig"}>
                                <img alt="barn" className="barneikon" src={ikon}/>
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Button variant={"primary"} type={"button"} onClick={() => setIsOpen(true)}>
                                        {t("knapp.leggTilBarn")}
                                    </Button>
                                </div>

                                <BodyShort size={"small"} className={"center mute"}>
                                    {t("omBarn.valgfritt")}
                                </BodyShort>
                            </div>
                        </div>
                    </div>

                    <SkjemaGruppe>
                        <Accordion>
                            <AccordionItem tittel={"Nytt barn"}>
                                <div>TEST 2</div>
                            </AccordionItem>
                        </Accordion>
                    </SkjemaGruppe>

                    <Modal open={isOpen} onClose={() => setIsOpen(false)} className={"ey-modal"}>
                        <LeggTilBarnSkjema lagre={leggTilBarn} avbryt={() => setIsOpen(false)}
                                           fnrRegistrerteBarn={fnrRegistrerteBarn}/>
                    </Modal>
                </SkjemaGruppe>

                <RHFSpoersmaalRadio name={"gravidEllerNyligFoedt"} legend={t("omBarn.gravidEllerNyligFoedt")}/>

                <Navigasjon
                    forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                    neste={{ onClick: handleSubmit(lagreNeste) }}
                />
            </form>
        </FormProvider>
    );
};

export default OpplysningerOmBarn;
