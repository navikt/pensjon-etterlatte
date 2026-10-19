import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IInntekt, SkalGaaAvMedAlderspensjonValg, SoekbareYtelserNAV } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { StegPath } from '../../../../typer/steg'
import { OppsummeringInntektenDin } from './OppsummeringInntektenDin'

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(cleanup)

const renderInntekt = (inntektenDin: IInntekt, senderSoeknad = false) =>
    render(
        <MemoryRouter>
            <OppsummeringInntektenDin inntektenDin={inntektenDin} senderSoeknad={senderSoeknad} />
        </MemoryRouter>
    )

describe('Gruppering av inntekt', () => {
    it('beholder periodeoverskrifter og beløp uten nøstede svarlister', () => {
        const { container, getByRole, getByText, queryByText, getAllByRole } = renderInntekt({
            inntektFremTilDoedsfallet: { arbeidsinntekt: '100000' },
            forventetInntektIAar: { arbeidsinntekt: '200000' },
            forventetInntektTilNesteAar: { arbeidsinntekt: '300000' },
            ytelserNAV: {
                svar: IValg.JA,
                soekteYtelser: [SoekbareYtelserNAV.dagspenger, SoekbareYtelserNAV.sykepenger],
            },
            ytelserAndre: { svar: IValg.NEI },
        })

        expect(container.querySelectorAll('dl dl')).toHaveLength(0)
        expect(getAllByRole('heading', { level: 3 })).toHaveLength(3)
        for (const [periode, belop] of [
            ['inntektFremTilDoedsfallet', '100000'],
            ['forventetInntektIAar', '200000'],
            ['forventetInntektTilNesteAar', '300000'],
        ]) {
            const overskrift = getByRole('heading', { level: 3, name: `inntektenDin.${periode}.tittel` })
            const svar = overskrift.nextElementSibling
            expect(overskrift.closest('dl')).toBeNull()
            expect(svar?.tagName).toBe('DL')
            expect(svar?.contains(getByText(belop))).toBe(true)
            expect(svar?.contains(getByText(`inntektenDin.${periode}.arbeidsinntekt`))).toBe(true)
        }
        expect(queryByText('inntektenDin.ytelserNAV.tittel')).toBeNull()
        expect(queryByText('inntektenDin.ytelserAndre.tittel')).toBeNull()
        expect(getByText('soekbarYtelse.dagspenger, soekbarYtelse.sykepenger').closest('dl')?.parentElement).toBe(
            container.querySelector('.aksel-form-summary')
        )
        expect(getAllByRole('link')).toHaveLength(1)
        expect(getByRole('link').getAttribute('href')).toBe(`/skjema/steg/${StegPath.InntektenDin}`)
        expect(getByRole('link').closest('.aksel-form-summary__footer')).not.toBeNull()
    })

    it('utelater periodeoverskrifter når periodene mangler og beholder deaktivert endrelenke', () => {
        const { container, queryAllByRole, getByRole } = renderInntekt({}, true)

        expect(queryAllByRole('heading', { level: 3 })).toHaveLength(0)
        expect(container.querySelectorAll('dl')).toHaveLength(1)
        expect(getByRole('link').classList.contains('disabled')).toBe(true)
    })

    it.each([
        [SkalGaaAvMedAlderspensjonValg.JA, 'inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'],
        [
            SkalGaaAvMedAlderspensjonValg.TAR_ALLEREDE_UT_ALDERSPENSJON,
            'inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon.tarAlleredeUtAlderspensjon',
        ],
    ] as const)('viser alderspensjon som direkte svar uten gjentatt undertittel for %s', (valg, datoSporsmaal) => {
        const { container, getByText, getAllByText } = renderInntekt({
            skalGaaAvMedAlderspensjon: { valg, datoForAaGaaAvMedAlderspensjon: '2027-01-01' },
        })

        expect(container.querySelectorAll('dl dl')).toHaveLength(0)
        expect(getAllByText('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar')).toHaveLength(1)
        expect(getByText(datoSporsmaal).closest('dl')).toBe(getByText('01.01.2027').closest('dl'))
    })
})
