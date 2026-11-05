import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from './featureToggles/FeatureTogglesContext.tsx'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { Spraak } from './spraak/spraak.ts'
import { Vedlikeholdsvarsel } from './Vedlikeholdsvarsel.tsx'

vi.mock('./featureToggles/FeatureTogglesContext.tsx')
vi.mock('./spraak/SpraakContext.tsx', () => ({ useSpraak: vi.fn() }))
vi.mock('./logger/logger.ts', () => ({ logger: { generalError: vi.fn() } }))

describe('Vedlikeholdsvarsel', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useFeatureToggle).mockReturnValue({
            name: FeatureToggleNavn.VEDLIKEHOLDSVARSEL,
            status: FeatureToggleStatus.PAA,
        })
        vi.mocked(useSpraak).mockReturnValue(Spraak.BOKMAAL)
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
        [Spraak.BOKMAAL, 'Søknaden kan ikke sendes inn', 'Prøv igjen etter kl. 21.00.'],
        [Spraak.NYNORSK, 'Søknaden kan ikkje sendast inn', 'Prøv igjen etter kl. 21.00.'],
        [Spraak.ENGELSK, 'You cannot submit your application', 'Try again after 21:00.'],
    ] as const)('shows the localized maintenance warning in %s', (spraak, tittel, proevIgjen) => {
        vi.mocked(useSpraak).mockReturnValue(spraak)

        const html = renderToStaticMarkup(<Vedlikeholdsvarsel />)

        expect(useFeatureToggle).toHaveBeenCalledWith('varsling-nedetid')
        expect(html).toContain('role="alert"')
        expect(html).toContain(tittel)
        expect(html).toMatch(/5(?:\. november| November)/)
        expect(html).toMatch(/15[.:]30/)
        expect(html).toMatch(/21[.:]00/)
        expect(html).not.toMatch(/48 (?:timer|timar|hours)/)
        expect(html).toContain(proevIgjen)
    })
})
