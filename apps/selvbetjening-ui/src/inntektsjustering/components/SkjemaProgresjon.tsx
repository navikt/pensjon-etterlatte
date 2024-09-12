import { FormProgress } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'
import { Navigate } from 'react-router-dom'
import { Spraak } from '../../common/spraak/spraak.ts'

export const SkjemaProgresjon = ({ aktivtSteg, valgtSpraak }: { aktivtSteg: number; valgtSpraak: Spraak }) => {
    const { data, error }: SWRResponse<never[], boolean, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams('sanityQuery=*[_type == "fellesKomponenter"].skjemaProgresjon')
    )

    if (error) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!data?.length && (
            <FormProgress
                totalSteps={4}
                activeStep={aktivtSteg}
                translations={{
                    step: `${data[0]['stegXAvX']['steg'][valgtSpraak]} ${aktivtSteg} ${data[0]['stegXAvX']['av'][valgtSpraak]} ${4}`,
                    showAllSteps: data[0]['visAlleSteg'][valgtSpraak],
                    hideAllSteps: data[0]['skjulAlleSteg'][valgtSpraak],
                }}
            >
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg1'][valgtSpraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg2'][valgtSpraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg3'][valgtSpraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg4'][valgtSpraak]}</FormProgress.Step>
            </FormProgress>
        )
    )
}
