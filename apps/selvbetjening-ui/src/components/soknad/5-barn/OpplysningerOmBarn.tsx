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
import { Alert, BodyShort, Button, Modal, Panel, Heading } from "@navikt/ds-react";
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import { deepCopy } from "../../../utils/deepCopy";
import AndreStoenader from "./AndreStoenader";

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

    const erValidert = state.opplysningerOmBarn.erValidert
    const registrerteBarn = watch("barn")

    const getFnrRegistrerteBarn = (): string[] => {
        if (registrerteBarn !== undefined) {
            return registrerteBarn.map(barn => barn.foedselsnummer !== undefined ? barn.foedselsnummer : "")
        } else {
            return []
        }
    }

    const fnrRegistrerteBarn = (aktivBarnIndex: number): string[] => {
        const fnr = getFnrRegistrerteBarn()
        fnr.splice(aktivBarnIndex, 1)
        return fnr
    }

    const { fields, append, update, remove } = useFieldArray({
        name: "barn",
        control: methods.control,
    });

    const [aktivBarnIndex, setAktivBarnIndex] = useState<number | undefined>(undefined)

    const leggtilNyttBarn = () => {
        append({})
        setAktivBarnIndex(fields.length)
    }

    const fjernNyttBarn = () => {
        remove(aktivBarnIndex)
    }

    const oppdaterBarn = (barn: IBarn) => {
        if (aktivBarnIndex !== undefined) {
            update(aktivBarnIndex, barn)
        }
        setAktivBarnIndex(undefined)
    }

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
                {aktivBarnIndex === undefined &&
                <>
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
                                <BarnInfokort key={uuid()} barn={field as IBarn} index={index} fjern={remove}
                                              setAktivBarnIndex={() => setAktivBarnIndex(index)}/>
                            ))}

                            <div className={"infokort"}>
                                <div className={"infokort__header gjennomsiktig"}>
                                    <img alt="barn" className="barneikon" src={ikon}/>
                                </div>
                                <div className={"infokort__informasjonsboks"}>
                                    <div className={"informasjonsboks-innhold"}>
                                        <Button variant={"primary"} type={"button"} onClick={leggtilNyttBarn}>
                                            {t("knapp.leggTilBarn")}
                                        </Button>
                                    </div>

                                    <BodyShort size={"small"} className={"center mute"}>
                                        {t("omBarn.valgfritt")}
                                    </BodyShort>
                                </div>
                            </div>
                        </div>
                    </SkjemaGruppe>
                    <RHFSpoersmaalRadio name={"gravidEllerNyligFoedt"} legend={t("omBarn.gravidEllerNyligFoedt")}/>

                    <AndreStoenader soeknad={state} barn={registrerteBarn} />

                    <Navigasjon
                        forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                        neste={{ onClick: handleSubmit(lagreNeste) }}
                    />
                </>
                }

                {aktivBarnIndex !== undefined &&
                <LeggTilBarnSkjema lagre={oppdaterBarn} avbryt={() => setAktivBarnIndex(undefined)}
                                   fnrRegistrerteBarn={fnrRegistrerteBarn(aktivBarnIndex)}
                                   barn={fields[aktivBarnIndex] as IBarn}
                                   fjernAvbruttNyttBarn={fjernNyttBarn}
                />
                }

            </form>
        </FormProvider>
    );
};

export default OpplysningerOmBarn;
