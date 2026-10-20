import { useFormContext } from 'react-hook-form'
import { IMerOmSituasjonenDin, JobbStatus } from '../../../../typer/situasjon'
import React from 'react'
import Arbeidstaker from './Arbeidstaker'
import Selvstendig from './Selvstendig'

const NavaerendeArbeidsforhold = () => {
    const { watch } = useFormContext<IMerOmSituasjonenDin>()
    const jobbStatus = watch('jobbStatus')

    return (
        <>
            {jobbStatus?.includes(JobbStatus.arbeidstaker) && <Arbeidstaker />}

            {jobbStatus?.includes(JobbStatus.selvstendig) && <Selvstendig />}

        </>
    )
}

export default NavaerendeArbeidsforhold
