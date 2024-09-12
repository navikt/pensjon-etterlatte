import { FormProgress } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../../utils/api.ts'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'

export const SkjemaProgresjon = ({ aktivtSteg }: { aktivtSteg: number }) => {
    const spraak = useSpraak()

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
                    step: `${data[0]['stegXAvX']['steg'][spraak]} ${aktivtSteg} ${data[0]['stegXAvX']['av'][spraak]} ${4}`,
                    showAllSteps: data[0]['visAlleSteg'][spraak],
                    hideAllSteps: data[0]['skjulAlleSteg'][spraak],
                }}
            >
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg1'][spraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg2'][spraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg3'][spraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{data[0]['stegLabels']['steg4'][spraak]}</FormProgress.Step>
            </FormProgress>
        )
    )
}
