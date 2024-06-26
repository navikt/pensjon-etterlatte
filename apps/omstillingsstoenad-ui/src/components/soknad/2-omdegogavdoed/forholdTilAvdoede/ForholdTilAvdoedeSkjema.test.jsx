import { render, renderHook } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import ForholdTilAvdoedeSkjema from './ForholdTilAvdoedeSkjema'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
}))

describe('Forhold til avdoede', () => {
    it('Separert skal vise inngått partnerskap', () => {
        const { result } = renderHook(() =>
            useForm({ defaultValues: { forholdTilAvdoede: { relasjon: 'avdoede.relasjon.separert' } } })
        )
        const { getByLabelText } = render(
            <FormProvider {...result.current}>
                <ForholdTilAvdoedeSkjema />
            </FormProvider>
        )
        expect(
            getByLabelText('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')
        ).toBeDefined()
    })

    it('Gift skal vise inngått partnerskap', () => {
        const { result } = renderHook(() =>
            useForm({ defaultValues: { forholdTilAvdoede: { relasjon: 'avdoede.relasjon.gift' } } })
        )
        const { getByLabelText } = render(
            <FormProvider {...result.current}>
                <ForholdTilAvdoedeSkjema />
            </FormProvider>
        )
        expect(
            getByLabelText('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')
        ).toBeDefined()
    })

    it('Samboer skal vise spørsmål om felles barn', () => {
        const { result } = renderHook(() =>
            useForm({
                defaultValues: {
                    forholdTilAvdoede: {
                        relasjon: 'avdoede.relasjon.samboer',
                        fellesBarn: 'radiobuttons.nei',
                    },
                },
            })
        )
        const { getByText } = render(
            <FormProvider {...result.current}>
                <ForholdTilAvdoedeSkjema />
            </FormProvider>
        )

        expect(getByText('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')).toBeDefined()
        expect(getByText('omDegOgAvdoed.forholdTilAvdoede.tidligereGift')).toBeDefined()
    })

    it('Skilt skal vise inngått partnerskap', () => {
        const { result } = renderHook(() =>
            useForm({
                defaultValues: {
                    forholdTilAvdoede: {
                        relasjon: 'avdoede.relasjon.skilt',
                        fellesBarn: 'radiobuttons.ja',
                    },
                },
            })
        )
        const { getByLabelText, getByText } = render(
            <FormProvider {...result.current}>
                <ForholdTilAvdoedeSkjema />
            </FormProvider>
        )
        expect(
            getByLabelText('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')
        ).toBeDefined()
        expect(getByLabelText('omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse')).toBeDefined()
        expect(getByText('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')).toBeDefined()
        expect(getByText('omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn')).toBeDefined()
    })
})
