import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatureToggleName, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import useTranslation from '~hooks/useTranslation'
import en from '~locales/en'
import nb from '~locales/nb'
import nn from '~locales/nn'
import { MaintenanceAlert } from './MaintenanceAlert'

vi.mock('~context/featureToggle/FeatureToggleContext')
vi.mock('~hooks/useTranslation', () => ({ default: vi.fn() }))
vi.mock('~utils/logger', () => ({ logger: { generalError: vi.fn() } }))

describe('MaintenanceAlert', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useFeatureToggle).mockReturnValue({
            name: FeatureToggleName.MAINTENANCE_WARNING,
            status: FeatureToggleStatus.ENABLED,
        })
    })

    it.each([FeatureToggleStatus.DISABLED, FeatureToggleStatus.UNDEFINED, FeatureToggleStatus.FETCH_FAILED])(
        'hides the warning when the toggle status is %s',
        (status) => {
            vi.mocked(useFeatureToggle).mockReturnValue({
                name: FeatureToggleName.MAINTENANCE_WARNING,
                status,
            })
            vi.mocked(useTranslation).mockReturnValue({ t: (key) => key })

            expect(renderToStaticMarkup(<MaintenanceAlert />)).toBe('')
        }
    )

    it.each([
        ['nb', nb],
        ['nn', nn],
        ['en', en],
    ] as const)('shows the localized maintenance warning in %s', (_, locale) => {
        const translations: Record<string, string> = locale.app
        vi.mocked(useTranslation).mockReturnValue({ t: (key) => translations[key] })

        const html = renderToStaticMarkup(<MaintenanceAlert />)

        expect(useFeatureToggle).toHaveBeenCalledWith('varsling-nedetid')
        expect(useTranslation).toHaveBeenCalledWith('app')
        expect(html).toContain('role="alert"')
        expect(html).toContain(locale.app.maintenanceWarningTitle)
        expect(html).toContain(locale.app.maintenanceWarningContent)
        expect(html).toMatch(/5(?:\. november| November)/)
        expect(html).toMatch(/15[.:]30/)
        expect(html).toMatch(/21[.:]00/)
        expect(html).not.toMatch(/48 (?:timer|timar|hours)/)
    })
})
