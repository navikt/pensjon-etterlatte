import { cleanup, render } from '@testing-library/react'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HoeyesteUtdanning } from '../../../../api/dto/FellesOpplysninger'
import { Arbeidsmengde, IngenJobb, StillingType } from '../../../../typer/arbeidsforhold'
import { Sivilstatus } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import { IMerOmSituasjonenDin, JobbStatus } from '../../../../typer/situasjon'
import { Studieform } from '../../../../typer/utdanning'
import { OppsummeringBarnepensjon } from './OppsummeringBarnepensjon'
import { OppsummeringMerSituasjonenDin } from './OppsummeringMerSituasjonenDin'
import { OppsummeringOmDeg } from './OppsummeringOmDeg'
import { OppsummeringSituasjonenDin } from './OppsummeringSituasjonenDin'

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(cleanup)

const renderOppsummering = (children: ReactNode) => render(<MemoryRouter>{children}</MemoryRouter>)

describe('Gruppering i oppsummeringen', () => {
    it('viser personalia, telefon og alternativ adresse som direkte svar', () => {
        const { container, getByText, queryByText } = renderOppsummering(
            <OppsummeringOmDeg
                bruker={{ fornavn: 'Kari', etternavn: 'Nordmann', statsborgerskap: 'Norge' }}
                omDeg={{ kontaktinfo: { telefonnummer: '12345678' }, alternativAdresse: 'Testveien 1' }}
                senderSoeknad={false}
            />
        )

        const svar = container.querySelector('dl')
        expect(container.querySelectorAll('dl')).toHaveLength(1)
        expect(queryByText('omDeg.undertittel.personalia')).toBeNull()
        for (const verdi of ['Kari Nordmann', 'Norge', '12345678', 'Testveien 1']) {
            expect(getByText(verdi).closest('dl')).toBe(svar)
        }
    })

    it.each([IValg.JA, IValg.NEI])(
        'viser situasjonen uten statiske grupper når bosatt i Norge er %s',
        (bosattINorge) => {
            const { container, getByText, queryByText } = renderOppsummering(
                <OppsummeringSituasjonenDin
                    situasjonenDin={{
                        nySivilstatus: {
                            sivilstatus: Sivilstatus.samboerskap,
                            samboerskap: { samboer: { fornavn: 'Ola', etternavn: 'Nordmann' } },
                        },
                        omsorgMinstFemti: IValg.JA,
                        gravidEllerNyligFoedt: IValg.NEI,
                        bosattINorge,
                        bosattLand: 'Danmark',
                        oppholderSegIUtlandet: { svar: IValg.JA, oppholdsland: 'Sverige' },
                    }}
                    senderSoeknad={false}
                />
            )

            const svar = container.querySelector('dl')
            expect(container.querySelectorAll('dl')).toHaveLength(1)
            expect(queryByText('situasjonenDin.omsorgForBarn.tittel')).toBeNull()
            expect(queryByText('situasjonenDin.oppholdUtenforNorge.tittel')).toBeNull()
            expect(getByText('Ola').closest('dl')).toBe(svar)
            expect(getByText('situasjonenDin.omsorgMinstFemti').closest('dl')).toBe(svar)
            expect(getByText('situasjonenDin.gravidEllerNyligFoedt').closest('dl')).toBe(svar)
            expect(getByText('situasjonenDin.bosattINorge').closest('dl')).toBe(svar)
            expect(getByText(bosattINorge === IValg.JA ? 'Sverige' : 'Danmark').closest('dl')).toBe(svar)
            expect(queryByText(bosattINorge === IValg.JA ? 'Danmark' : 'Sverige')).toBeNull()
        }
    )

    it.each([
        JobbStatus.etablerer,
        JobbStatus.tilbud,
        JobbStatus.arbeidssoeker,
        JobbStatus.underUtdanning,
        JobbStatus.ingen,
    ])('viser enkeltstående svar og flervalg uten grupper eller undertitler for %s', (jobbStatus) => {
        const merOmSituasjonenDin: IMerOmSituasjonenDin = {
            jobbStatus: [jobbStatus],
            etablererVirksomhet: { hvaHeterVirksomheten: 'Ny virksomhet' },
            tilbudOmJobb: {
                arbeidssted: 'Nytt arbeidssted',
                ansettelsesforhold: StillingType.fast,
                arbeidsmengde: { svar: '100' },
                aktivitetsplan: { svar: IValg.NEI },
            },
            arbeidssoeker: { svar: IValg.JA, aktivitetsplan: { svar: IValg.NEI } },
            utdanning: {
                naavaerendeUtdanning: { studiested: 'Universitetet', studieform: Studieform.heltid },
                hoyesteFullfoerteUtdanning: [HoeyesteUtdanning.GRUNNSKOLE, HoeyesteUtdanning.FAGBREV],
                aktivitetsplan: { svar: IValg.NEI },
            },
            annenSituasjon: {
                beskrivelse: [IngenJobb.annet],
                annet: { beskrivelse: 'Annen situasjon' },
            },
        }
        const { container, getByText, queryByText } = renderOppsummering(
            <OppsummeringMerSituasjonenDin merOmSituasjonenDin={merOmSituasjonenDin} senderSoeknad={false} />
        )

        const svar = container.querySelector('dl')
        expect(container.querySelectorAll('dl')).toHaveLength(1)
        for (const undertittel of [
            'etablererVirksomhet.tittel',
            'tilbudOmJobb.tittel',
            'arbeidssoeker.tittel',
            'utdanning.tittel',
            'annenSituasjon.tittel',
            'utdanning.tittelFullfoert',
        ]) {
            expect(queryByText(`merOmSituasjonenDin.${undertittel}`)).toBeNull()
        }
        expect(getByText(jobbStatus).closest('dl')).toBe(svar)
        expect(getByText('GRUNNSKOLE, FAGBREV').closest('dl')).toBe(svar)
        const sporsmaal = [...container.querySelectorAll('dt')].map((element) => element.textContent)
        expect(sporsmaal[0]).toBe('merOmSituasjonenDin.jobbStatus')
        expect(sporsmaal.at(-1)).toBe('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning')
        expect(sporsmaal.length).toBeGreaterThan(2)
    })

    it.each([0, 1, 2])('beholder grupper for %s arbeidsforhold og næringsvirksomheter', (antall) => {
        const merOmSituasjonenDin: IMerOmSituasjonenDin = {
            jobbStatus: [JobbStatus.arbeidstaker, JobbStatus.selvstendig],
            arbeidsforhold: Array.from({ length: antall }, (_, index) => ({
                arbeidsgiver: `Arbeidsgiver ${index + 1}`,
                ansettelsesforhold: StillingType.fast,
                arbeidsmengde: { svar: '100' },
            })),
            selvstendig: Array.from({ length: antall }, (_, index) => ({
                beskrivelse: `Virksomhet ${index + 1}`,
                arbeidsmengde: { svar: '20', type: Arbeidsmengde.timer },
            })),
        }
        const { container, getByText } = renderOppsummering(
            <OppsummeringMerSituasjonenDin merOmSituasjonenDin={merOmSituasjonenDin} senderSoeknad={false} />
        )

        const svar = container.querySelector('dl')
        expect(container.querySelectorAll('dl dl')).toHaveLength(antall * 2)
        expect(container.querySelectorAll('dl dl dl')).toHaveLength(0)
        for (let index = 1; index <= antall; index++) {
            for (const [type, navn] of [
                ['arbeidsforhold', `Arbeidsgiver ${index}`],
                ['selvstendig', `Virksomhet ${index}`],
            ]) {
                const gruppe = getByText(`merOmSituasjonenDin.${type}.tittel: ${navn}`).closest(
                    '.aksel-form-summary__answer'
                )
                expect(gruppe?.parentElement).toBe(svar)
                expect(gruppe?.querySelector('dl')?.contains(getByText(navn))).toBe(true)
            }
        }
    })

    it.each([0, 1, 2])('beholder én gruppe per barn når listen har %s barn', (antall) => {
        const barn = ['Kari', 'Per'].slice(0, antall).map((fornavn) => ({ fornavn, etternavn: 'Nordmann' }))
        const { container, getByText } = renderOppsummering(
            <OppsummeringBarnepensjon opplysningerOmBarn={{ barn }} senderSoeknad={false} />
        )

        const svar = container.querySelector('dl')
        expect(container.querySelectorAll('dl dl')).toHaveLength(antall)
        for (const barnet of barn) {
            const gruppe = getByText(`${barnet.fornavn} ${barnet.etternavn}`).closest('.aksel-form-summary__answer')
            expect(gruppe?.parentElement).toBe(svar)
            expect(gruppe?.querySelector('dl')?.contains(getByText(barnet.fornavn))).toBe(true)
        }
    })
})
