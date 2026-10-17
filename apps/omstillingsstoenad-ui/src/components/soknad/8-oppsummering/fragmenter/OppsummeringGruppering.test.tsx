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

    it.each([IValg.JA, IValg.NEI])('deler situasjonen i undertitler når bosatt i Norge er %s', (bosattINorge) => {
        const { container, getByText, queryByText, getAllByRole } = renderOppsummering(
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

        const svarlister = container.querySelectorAll('dl')
        expect(svarlister).toHaveLength(3)
        expect(container.querySelectorAll('dl dl')).toHaveLength(0)
        expect(getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
            'situasjonenDin.omsorgForBarn.tittel',
            'situasjonenDin.oppholdUtenforNorge.tittel',
        ])
        expect(getByText('Ola').closest('dl')).toBe(svarlister[0])
        expect(getByText('situasjonenDin.omsorgMinstFemti').closest('dl')).toBe(svarlister[1])
        expect(getByText('situasjonenDin.gravidEllerNyligFoedt').closest('dl')).toBe(svarlister[1])
        expect(getByText('situasjonenDin.bosattINorge').closest('dl')).toBe(svarlister[2])
        expect(getByText(bosattINorge === IValg.JA ? 'Sverige' : 'Danmark').closest('dl')).toBe(svarlister[2])
        expect(queryByText(bosattINorge === IValg.JA ? 'Danmark' : 'Sverige')).toBeNull()
    })

    it.each([
        JobbStatus.etablerer,
        JobbStatus.tilbud,
        JobbStatus.arbeidssoeker,
        JobbStatus.underUtdanning,
        JobbStatus.ingen,
    ] as const)('viser svarene for %s under riktig undertittel', (jobbStatus) => {
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
        const { container, getByText, getAllByRole } = renderOppsummering(
            <OppsummeringMerSituasjonenDin merOmSituasjonenDin={merOmSituasjonenDin} senderSoeknad={false} />
        )

        const undertittel = {
            [JobbStatus.etablerer]: 'merOmSituasjonenDin.etablererVirksomhet.tittel',
            [JobbStatus.tilbud]: 'merOmSituasjonenDin.tilbudOmJobb.tittel',
            [JobbStatus.arbeidssoeker]: 'merOmSituasjonenDin.arbeidssoeker.tittel',
            [JobbStatus.underUtdanning]: 'merOmSituasjonenDin.utdanning.tittel',
            [JobbStatus.ingen]: 'merOmSituasjonenDin.annenSituasjon.tittel',
        }[jobbStatus]

        const svarlister = container.querySelectorAll('dl')
        expect(svarlister).toHaveLength(3)
        expect(container.querySelectorAll('dl dl')).toHaveLength(0)
        expect(getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
            undertittel,
            'merOmSituasjonenDin.utdanning.tittelFullfoert',
        ])
        expect(getByText(jobbStatus).closest('dl')).toBe(svarlister[0])
        expect(getByText(undertittel).closest('dl')).toBeNull()
        expect(getByText('GRUNNSKOLE, FAGBREV').closest('dl')).toBe(svarlister[2])
        const sporsmaal = [...container.querySelectorAll('dt')].map((element) => element.textContent)
        expect(sporsmaal[0]).toBe('merOmSituasjonenDin.jobbStatus')
        expect(sporsmaal.at(-1)).toBe('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning')
        expect(sporsmaal.length).toBeGreaterThan(2)
    })

    it('skiller jobbtilbud og pågående utdanning med egne undertitler', () => {
        const { container, getByRole, getByText } = renderOppsummering(
            <OppsummeringMerSituasjonenDin
                merOmSituasjonenDin={{
                    jobbStatus: [JobbStatus.tilbud, JobbStatus.underUtdanning],
                    tilbudOmJobb: {
                        arbeidssted: 'Nytt arbeidssted',
                        ansettelsesforhold: StillingType.fast,
                        arbeidsmengde: { svar: '100' },
                        aktivitetsplan: { svar: IValg.NEI },
                    },
                    utdanning: {
                        naavaerendeUtdanning: { studiested: 'Universitetet', studieform: Studieform.heltid },
                        hoyesteFullfoerteUtdanning: [HoeyesteUtdanning.FAGBREV],
                        aktivitetsplan: { svar: IValg.NEI },
                    },
                }}
                senderSoeknad={false}
            />
        )

        expect(container.querySelectorAll('dl')).toHaveLength(4)
        expect(container.querySelectorAll('dl dl')).toHaveLength(0)
        for (const [tittel, verdi] of [
            ['merOmSituasjonenDin.tilbudOmJobb.tittel', 'Nytt arbeidssted'],
            ['merOmSituasjonenDin.utdanning.tittel', 'Universitetet'],
            ['merOmSituasjonenDin.utdanning.tittelFullfoert', 'FAGBREV'],
        ]) {
            const overskrift = getByRole('heading', { level: 3, name: tittel })
            expect(overskrift.closest('dl')).toBeNull()
            expect(overskrift.nextElementSibling?.tagName).toBe('DL')
            expect(getByText(verdi).closest('dl')).toBe(overskrift.nextElementSibling)
        }
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
        const { container, getByText, queryAllByRole } = renderOppsummering(
            <OppsummeringMerSituasjonenDin merOmSituasjonenDin={merOmSituasjonenDin} senderSoeknad={false} />
        )

        expect(container.querySelectorAll('dl dl')).toHaveLength(antall * 2)
        expect(container.querySelectorAll('dl dl dl')).toHaveLength(0)
        expect(queryAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
            ...(antall === 0
                ? []
                : ['merOmSituasjonenDin.arbeidsforhold.tittel', 'merOmSituasjonenDin.selvstendig.tittel']),
            'merOmSituasjonenDin.utdanning.tittelFullfoert',
        ])
        for (let index = 1; index <= antall; index++) {
            for (const [tittel, navn] of [
                ['merOmSituasjonenDin.arbeidsforhold.tittel', `Arbeidsgiver ${index}`],
                ['merOmSituasjonenDin.selvstendig.tittel', `Virksomhet ${index}`],
            ]) {
                const gruppe = getByText(navn, { selector: 'dt' }).closest('.aksel-form-summary__answer')
                const underseksjon = getByText(tittel).closest('section')
                expect(underseksjon?.contains(gruppe)).toBe(true)
                expect(gruppe?.querySelector('dl')?.contains(getByText(navn, { selector: 'dd' }))).toBe(true)
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
