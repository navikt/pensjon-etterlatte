import { mapTilBarnepensjonSoeknadListe } from './soeknadMapper'
import { BankkontoType, JaNeiVetIkke } from './FellesOpplysninger'
import { ParentRelationType } from '../../types/person'
import { ApplicantRole } from '../../components/application/scenario/ScenarioSelection'
import { IApplication } from '../../context/application/application'
import { User } from '../../context/user/user'
import { Avdoed, GjenlevendeForelder } from './Person'
import { Barnepensjon } from './InnsendtSoeknad'

const user: User = {
    fornavn: 'STOR',
    etternavn: 'SNERK',
    foedselsnummer: '11057523044',
    foedselsaar: 1975,
    foedselsdato: new Date(1975, 4, 11),
    telefonnummer: '11111111',
    spraak: 'nb',
    adresse: 'Adresse-mock',
    husnummer: '1',
    husbokstav: undefined,
    postnummer: '0000',
    poststed: 'Poststed-mock',
    statsborgerskap: 'Statsborgerskap-mock',
    sivilstatus: 'GIFT',
}

const t = (key: string, _: any) => key

describe('Generelle tester', () => {
    it('Mapping av søknad uten barn kaster feil', () => {
        expect.assertions(1)

        const application: IApplication = { aboutChildren: { children: [] }, aboutYou: {} }

        try {
            mapTilBarnepensjonSoeknadListe(t, application, user)
        } catch (e) {
            expect(e.message).toEqual('Kan ikke sende inn søknad med tom liste over barn!')
        }
    })

    it('Stopp mapping hvis bruker har ikke samtykket', () => {
        try {
            const application: IApplication = { aboutChildren: { children: [{}] }, aboutYou: {} }
            mapTilBarnepensjonSoeknadListe(t, application, user)
        } catch (e) {
            expect(e.message).toEqual('Kan ikke sende inn søknad uten å ha samtykket!')
        }
    })
})

describe('Gjenlevende forelder søker på vegne av barn', () => {
    it('Mapper søknad som forventet', () => {
        const application = {
            applicant: {
                applicantRole: ApplicantRole.PARENT,
                consent: true,
            },
            aboutYou: {},
            secondParent: {
                firstName: 'Sedat',
                lastName: 'Ripsbærbusk',
                fnrDnr: '26117512737',
                citizenship: 'Norge',
                dateOfDeath: '01-01-2022',
                staysAbroad: {
                    hasStaysAbroad: JaNeiVetIkke.NEI,
                },
                selfEmplyment: {
                    wasSelfEmployed: JaNeiVetIkke.NEI,
                },
                occupationalInjury: JaNeiVetIkke.VET_IKKE,
                militaryService: {
                    completed: JaNeiVetIkke.JA,
                    period: '1984',
                },
            },
            aboutChildren: {
                children: [createTestChild('Blåøyd', 'Saks', '05111850870')],
            },
        }

        const soeknader: Barnepensjon[] = mapTilBarnepensjonSoeknadListe(t, application, user)

        expect(soeknader.length).toBe(1)

        const soeknad = soeknader[0]

        expect(soeknad.foreldre?.length).toBe(2)

        const gjenlevende = soeknad.foreldre?.[0]!! as GjenlevendeForelder
        expect(gjenlevende.fornavn.svar).toEqual(user.fornavn)
        expect(gjenlevende.etternavn.svar).toEqual(user.etternavn)
        expect(gjenlevende.foedselsnummer.svar).toEqual(user.foedselsnummer)
        expect(gjenlevende.statsborgerskap.svar).toEqual(user.statsborgerskap)
        expect(gjenlevende.adresse?.svar).toEqual(user.adresse)
        expect(gjenlevende.kontaktinfo?.telefonnummer.svar.innhold).toEqual(user.telefonnummer)

        const avdoed = soeknad.foreldre?.[1]!! as Avdoed
        expect(avdoed.fornavn.svar).toEqual(application.secondParent.firstName)
        expect(avdoed.etternavn.svar).toEqual(application.secondParent.lastName)
        expect(avdoed.foedselsnummer.svar).toEqual(application.secondParent.fnrDnr)
        expect(avdoed.statsborgerskap.svar.innhold).toEqual(application.secondParent.citizenship)
        expect(avdoed.datoForDoedsfallet.svar.innhold).toEqual(application.secondParent.dateOfDeath)
        expect(avdoed.militaertjeneste?.svar.verdi).toBe(application.secondParent.militaryService.completed)
    })
})

// TODO:
describe('Test mapping foreldre', () => {
    it('Mapping av forenklede foreldre fungerer', () => {})
    it('Mapping av gjenlenvende og/eller avdøde foreldre fungerer', () => {})
})

const createTestChild = (firstName: string, lastName: string, fnrDnr: string) => ({
    firstName,
    lastName,
    fnrDnr,
    childHasGuardianship: {
        answer: JaNeiVetIkke.NEI,
        firstName: '',
        lastName: '',
        fnr: '',
    },
    parents: ParentRelationType.BOTH,
    citizenship: '',
    staysAbroad: {
        answer: JaNeiVetIkke.NEI,
    },
    appliesForChildrensPension: true,
    paymentDetails: {
        accountType: BankkontoType.NORSK,
        bankAccount: '1233.22.12332',
        taxWithhold: {
            answer: JaNeiVetIkke.JA,
            taxPercentage: '21%',
        },
    },
})
