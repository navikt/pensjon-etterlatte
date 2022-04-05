import { mapTilBarnepensjonSoeknadListe } from './soeknadMapper'
import { BankkontoType, JaNeiVetIkke, OppholdUtlandType } from './FellesOpplysninger'
import { IChild, ParentRelationType } from '../../types/person'
import { ApplicantRole } from '../../components/application/scenario/ScenarioSelection'
import { IApplicant, IApplication, IDeceasedParent, IParent } from '../../context/application/application'
import { User } from '../../context/user/user'
import { Avdoed, Forelder, GjenlevendeForelder, PersonType } from './Person'
import { hentForeldre, mapForeldreMedUtvidetInfo } from './foreldreMapper'

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
        } catch (e: any) {
            expect(e.message).toEqual('Kan ikke sende inn søknad med tom liste over barn!')
        }
    })

    it('Stopp mapping hvis bruker har ikke samtykket', () => {
        try {
            const application: IApplication = { aboutChildren: { children: [{}] }, aboutYou: {} }
            mapTilBarnepensjonSoeknadListe(t, application, user)
        } catch (e: any) {
            expect(e.message).toEqual('Kan ikke sende inn søknad uten å ha samtykket!')
        }
    })
})

describe('Gjenlevende forelder søker på vegne av barn', () => {
    it('Mapper søknad som forventet', () => {
        const application: IApplication = {
            applicant: createApplicant(ApplicantRole.PARENT),
            aboutYou: {},
            secondParent: {
                ...createParent('Sedat', 'Ripsbærbusk', '26117512737'),
                dateOfDeath: new Date(2022, 1, 1),
                staysAbroad: {
                    hasStaysAbroad: JaNeiVetIkke.NEI,
                },
                selfEmplyment: {
                    wasSelfEmployed: JaNeiVetIkke.NEI,
                    selfEmplymentDetails: {},
                },
                occupationalInjury: JaNeiVetIkke.VET_IKKE,
                militaryService: {
                    completed: JaNeiVetIkke.JA,
                    period: '1984',
                },
            },
            aboutChildren: {
                children: [createChild('Blåøyd', 'Saks', '05111850870')],
            },
        }

        const soeknader = mapTilBarnepensjonSoeknadListe(t, application, user)

        expect(soeknader.length).toBe(1)

        const soeknad = soeknader[0]

        const foreldre = soeknad.foreldre!!
        expect(foreldre.length).toBe(2)

        const gjenlevende = foreldre[0] as GjenlevendeForelder
        expect(gjenlevende.fornavn.svar).toEqual(user.fornavn)
        expect(gjenlevende.etternavn.svar).toEqual(user.etternavn)
        expect(gjenlevende.foedselsnummer.svar).toEqual(user.foedselsnummer)
        expect(gjenlevende.statsborgerskap.svar).toEqual(user.statsborgerskap)
        expect(gjenlevende.adresse!!.svar).toEqual(user.adresse)
        expect(gjenlevende.kontaktinfo.telefonnummer.svar.innhold).toEqual(user.telefonnummer)

        const secondParent = application.secondParent!! as IDeceasedParent
        const avdoed = foreldre[1] as Avdoed
        expect(avdoed.fornavn.svar).toEqual(secondParent.firstName)
        expect(avdoed.etternavn.svar).toEqual(secondParent.lastName)
        expect(avdoed.foedselsnummer.svar).toEqual(secondParent.fnrDnr)
        expect(avdoed.statsborgerskap.svar.innhold).toEqual(secondParent.citizenship)
        expect(avdoed.datoForDoedsfallet.svar.innhold).toEqual(secondParent.dateOfDeath)
        expect(avdoed.militaertjeneste!!.svar.verdi).toBe(secondParent.militaryService!!.completed)
    })
})

describe('Test mapping foreldre', () => {
    const compareParents = (forelder: Forelder, parent: IParent) => {
        expect(forelder.type).toEqual(PersonType.FORELDER)
        expect(forelder.fornavn.svar).toEqual(parent.firstName)
        expect(forelder.etternavn.svar).toEqual(parent.lastName)
        expect(forelder.foedselsnummer.svar).toEqual(parent.fnrDnr)
    }

    const compareParentsWithUser = (forelder: Forelder, user: User) => {
        expect(forelder.type).toEqual(PersonType.FORELDER)
        expect(forelder.fornavn.svar).toEqual(user.fornavn)
        expect(forelder.etternavn.svar).toEqual(user.etternavn)
        expect(forelder.foedselsnummer.svar).toEqual(user.foedselsnummer)
    }

    it('Mapping av forenklede foreldre fungerer - forelder søker', () => {
        expect.assertions(19)

        const application: IApplication = {
            applicant: createApplicant(ApplicantRole.PARENT),
            aboutYou: {},
            firstParent: undefined,
            secondParent: createParent('Sedat', 'Ripsbærbusk', '26117512737'),
        }

        const child: IChild = { parents: ParentRelationType.BOTH }
        const foreldreListe1 = hentForeldre(t, child, application, user)

        expect(foreldreListe1.length).toEqual(2)
        compareParentsWithUser(foreldreListe1[0], user)
        compareParents(foreldreListe1[1], application.secondParent!!)

        const childToFirstParent: IChild = { parents: ParentRelationType.FIRST_PARENT }
        const foreldreListe2 = hentForeldre(t, childToFirstParent, application, user)
        expect(foreldreListe2.length).toEqual(1)
        compareParentsWithUser(foreldreListe2[0], user)

        const childToSecondParent: IChild = { parents: ParentRelationType.SECOND_PARENT }
        const foreldreListe3 = hentForeldre(t, childToSecondParent, application, user)
        expect(foreldreListe3.length).toEqual(1)

        compareParents(foreldreListe3[0], application.secondParent!!)
    })

    it('Mapping av forenklede foreldre fungerer - verge søker', () => {
        expect.assertions(19)

        const application: IApplication = {
            applicant: createApplicant(ApplicantRole.GUARDIAN),
            aboutYou: {},
            firstParent: createParent('Grønn', 'Kopp', '29018322402'),
            secondParent: createParent('Sedat', 'Ripsbærbusk', '26117512737'),
        }

        const child: IChild = { parents: ParentRelationType.BOTH }
        const foreldreListe1 = hentForeldre(t, child, application, user)

        expect(foreldreListe1.length).toEqual(2)
        compareParents(foreldreListe1[0], application.firstParent!!)
        compareParents(foreldreListe1[1], application.secondParent!!)

        const childToFirstParent: IChild = { parents: ParentRelationType.FIRST_PARENT }
        const foreldreListe2 = hentForeldre(t, childToFirstParent, application, user)
        expect(foreldreListe2.length).toEqual(1)
        compareParents(foreldreListe2[0], application.firstParent!!)

        const childToSecondParent: IChild = { parents: ParentRelationType.SECOND_PARENT }
        const foreldreListe3 = hentForeldre(t, childToSecondParent, application, user)
        expect(foreldreListe3.length).toEqual(1)
        compareParents(foreldreListe3[0], application.secondParent!!)
    })

    /*it('Mapping av gjenlenvende/avdød fungerer - gjenlevende søker', () => {
        const child = createChild('Blåøyd', 'Saks', '05111850870')
        const application: IApplication = {
            applicant: createApplicant(ApplicantRole.PARENT),
            aboutYou: {},
            secondParent: createDeceased(createParent('Sedat', 'Ripsbærbusk', '26117512737')),
            aboutChildren: {
                children: [createChild('Blåøyd', 'Saks', '05111850870')],
            },
        }
        const foreldre = mapForeldreMedUtvidetInfo(t, child, application, user)
    })*/
})

const createApplicant = (role: ApplicantRole, consent?: boolean): IApplicant => ({
    consent: consent || true,
    applicantRole: role,
})

const createParent = (firstName: string, lastName: string, fnrDnr: string): IParent => ({
    firstName,
    lastName,
    fnrDnr,
    citizenship: 'Norge',
})

const createDeceased = (parent: IParent) => ({
    ...parent,
    dateOfDeath: new Date(2022, 1, 1),
    staysAbroad: {
        hasStaysAbroad: JaNeiVetIkke.JA,
        abroadStays: [
            {
                type: [OppholdUtlandType.BODD, OppholdUtlandType.ARBEIDET],
                country: '',
                fromDate: new Date(1990, 1, 1),
                toDate: new Date(1995, 1, 1),
                medlemFolketrygd: JaNeiVetIkke.VET_IKKE,
                pensionAmount: '',
            },
        ],
    },
    selfEmplyment: {
        wasSelfEmployed: JaNeiVetIkke.NEI,
        selfEmplymentDetails: {},
    },
    occupationalInjury: JaNeiVetIkke.VET_IKKE,
    militaryService: {
        completed: JaNeiVetIkke.JA,
        period: '1984',
    },
})

const createChild = (firstName: string, lastName: string, fnrDnr: string): IChild => ({
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
