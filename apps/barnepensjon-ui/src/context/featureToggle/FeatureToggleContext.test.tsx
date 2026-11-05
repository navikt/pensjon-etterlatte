/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '~utils/logger'
import { FeatureToggleName, FeatureToggleProvider, FeatureToggleStatus, useFeatureToggle } from './FeatureToggleContext'

const { post } = vi.hoisted(() => ({ post: vi.fn() }))

vi.mock('~api/axios', () => ({ axiosInstance: { post } }))
vi.mock('~utils/logger', () => ({ logger: { generalError: vi.fn() } }))

const ToggleStatus = () => <span>{useFeatureToggle(FeatureToggleName.MAINTENANCE_WARNING).status}</span>

describe('FeatureToggleProvider', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    afterEach(cleanup)

    it.each(Object.values(FeatureToggleStatus))('fetches the shared toggle with status %s', async (status) => {
        post.mockResolvedValue({
            data: [{ name: FeatureToggleName.MAINTENANCE_WARNING, status }],
        })

        render(
            <FeatureToggleProvider>
                <ToggleStatus />
            </FeatureToggleProvider>
        )

        await waitFor(() => {
            expect(screen.getByText(status)).toBeDefined()
            expect(post).toHaveBeenCalledWith('/api/feature', ['varsling-nedetid'])
        })
    })

    it('treats a missing toggle as undefined', async () => {
        post.mockResolvedValue({ data: [] })

        render(
            <FeatureToggleProvider>
                <ToggleStatus />
            </FeatureToggleProvider>
        )

        await waitFor(() => expect(post).toHaveBeenCalledOnce())
        expect(screen.getByText(FeatureToggleStatus.UNDEFINED)).toBeDefined()
    })

    it('logs a failed fetch without preventing the application from rendering', async () => {
        const error = new Error('Feature toggle request failed')
        post.mockRejectedValue(error)

        render(
            <FeatureToggleProvider>
                <ToggleStatus />
            </FeatureToggleProvider>
        )

        await waitFor(() =>
            expect(logger.generalError).toHaveBeenCalledWith({
                message: 'Unable to fetch feature toggles',
                error,
            })
        )
        expect(screen.getByText(FeatureToggleStatus.UNDEFINED)).toBeDefined()
    })
})
