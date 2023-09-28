import { useFormContext } from 'react-hook-form'
import { ISituasjon, JobbStatus } from '../../../../typer/situasjon'
import React from 'react'
import Arbeidstaker from './Arbeidstaker'
import Selvstendig from './Selvstendig'

const NavaerendeArbeidsforhold = () => {
    const { watch } = useFormContext<ISituasjon>()
    const jobbStatus = watch('jobbStatus')

    return (
        <>
            {jobbStatus?.includes(JobbStatus.arbeidstaker) && <Arbeidstaker />}

            {jobbStatus?.includes(JobbStatus.selvstendigENK) && <Selvstendig />}

            {jobbStatus?.includes(JobbStatus.selvstendigAS) && <Selvstendig />}
        </>
    )
}

export default NavaerendeArbeidsforhold
