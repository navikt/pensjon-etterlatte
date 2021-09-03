import { useFormContext } from "react-hook-form";
import { ISituasjon, JobbStatus } from "../../../../typer/situasjon";
import React from "react";
import Arbeidstaker from "./Arbeidstaker";
import Selvstendig from "./Selvstendig";

const NavaerendeArbeidsforhold = () => {
    const { watch } = useFormContext<ISituasjon>();
    const jobbStatus = watch("jobbStatus");

    return (
        <>
            {jobbStatus?.includes(JobbStatus.selvstendig) && <Selvstendig />}

            {jobbStatus?.includes(JobbStatus.arbeidstaker) && <Arbeidstaker />}
        </>
    );
};

export default NavaerendeArbeidsforhold;
