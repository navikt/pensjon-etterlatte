import { Feiloppsummering, SkjemaGruppe } from "nav-frontend-skjema";
import { TFunction, useTranslation } from "react-i18next";
import { FieldError, FieldErrors } from "react-hook-form/dist/types/errors";
import { FeiloppsummeringFeil } from "nav-frontend-skjema/src/feiloppsummering";

const getFieldErrors = (obj: FieldErrors): FieldError[] => {
    return Object.values(obj)
        .flatMap((value: any) => {
                if ((value as FieldError).type) return value
                else return getFieldErrors(value)
            }
        );
}

const konverterFeilmeldinger = (errors: FieldErrors, t: TFunction<"translation">): FeiloppsummeringFeil[] => {
    return getFieldErrors(errors)
        .map(error => {
            const name = error.ref!!.name;
            const type = error.type

            return {
                skjemaelementId: name,
                feilmelding: t(`feil.${name}.${type}`)
            }
        })
}

const Feilmeldinger = ({ errors }: { errors: FieldErrors }) => {
    const { t } = useTranslation();

    return (
        <>
            {!!Object.keys(errors).length && (
                <SkjemaGruppe>
                    <Feiloppsummering
                        tittel="For å gå videre må du rette opp følgende:"
                        feil={konverterFeilmeldinger(errors, t)}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default Feilmeldinger;
