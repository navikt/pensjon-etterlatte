import useSWR, { SWRResponse } from 'swr'
import { ApiError, apiURL } from '../../utils/api.ts'

export const useSanityInnhold = <T>(
    sanityQuery: string
): {
    innhold: T | undefined
    error: ApiError | undefined
    isLoading: boolean
} => {
    const { data, error, isLoading }: SWRResponse<T[], ApiError, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams(`sanityQuery=${sanityQuery}`)
    )

    return {
        innhold: data?.[data?.length - 1],
        error,
        isLoading,
    }
}
