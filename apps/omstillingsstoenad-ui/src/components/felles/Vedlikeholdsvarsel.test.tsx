import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import en from '~locales/en'
import nb from '~locales/nb'
import nn from '~locales/nn'
import { Vedlikeholdsvarsel } from './Vedlikeholdsvarsel'

const { translate } = vi.hoisted(() => ({ translate: vi.fn() }))

vi.mock('~context/featureToggle/FeatureToggleContext')
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: translate }) }))

describe('Vedlikeholdsvarsel', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useFeatureToggle).mockReturnValue({
            name: FeatureToggleNavn.VEDLIKEHOLDSVARSEL,
            status: FeatureToggleStatus.PAA,
        })
    })

    it.each([FeatureToggleStatus.AV, FeatureToggleStatus.UDEFINERT, FeatureToggleStatus.HENTING_FEILET])(
        'hides the warning when the toggle status is %s',
        (status) => {
            vi.mocked(useFeatureToggle).mockReturnValue({
                name: FeatureToggleNavn.VEDLIKEHOLDSVARSEL,
                status,
            })

            expect(renderToStaticMarkup(<Vedlikeholdsvarsel />)).toBe('')
        }
    )

    it.each([
        ['nb', nb],
        ['nn', nn],
        ['en', en],
    ] as const)('shows the localized maintenance warning in %s', (_, locale) => {
        const translations: Record<string, string> = locale
        translate.mockImplementation((key: string) => translations[key])

        const html = renderToStaticMarkup(<Vedlikeholdsvarsel />)

        expect(useFeatureToggle).toHaveBeenCalledWith('varsling-nedetid')
        expect(html).toContain('role="alert"')
        expect(html).toContain(locale['vedlikeholdsvarsel.tittel'])
        expect(html).toContain(locale['vedlikeholdsvarsel.innhold'])
        expect(html).toMatch(/5(?:\. november| November)/)
        expect(html).toMatch(/15[.:]30/)
        expect(html).toMatch(/21[.:]00/)
        expect(html).toContain('48')
    })
})
