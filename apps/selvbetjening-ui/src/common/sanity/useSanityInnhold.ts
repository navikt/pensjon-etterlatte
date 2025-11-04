import useSWR, { SWRResponse } from 'swr'
import { ApiError, apiURL } from '../api/api.ts'

export const useSanityInnhold = <T>(
    sanityQuery: string
): {
    innhold: T | undefined
    innholdError: ApiError | undefined
    innholdIsLoading: boolean
} => {
    const { data, error, isLoading }: SWRResponse<T[], ApiError, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams(`sanityQuery=${sanityQuery}`)
    )

    return {
        innhold: data?.[data?.length - 1],
        innholdError: error,
        innholdIsLoading: isLoading,
    }
}
