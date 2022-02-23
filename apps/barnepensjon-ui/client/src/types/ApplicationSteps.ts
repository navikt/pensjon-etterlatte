import { FC } from 'react'

export default interface ApplicationSteps
    extends FC<{
        next?: () => void
        previous?: () => void
    }> {}
