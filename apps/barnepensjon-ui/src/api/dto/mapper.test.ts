import { mapTilBarnepensjonSoeknadListe } from './soeknadMapper'
import { BankkontoType, JaNeiVetIkke, OppholdUtlandType } from './FellesOpplysninger'
import { IChild, ParentRelationType } from '../../types/person'
import { ApplicantRole } from '../../components/application/scenario/ScenarioSelection'
import {
    IAbroadStay,
    IApplicant,
    IApplication,
    IDeceasedParent,
    ILivingParent,
    IParent,
    ISelfEmployment,
    IStaysAbroad,
} from '../../context/application/application'
import { User } from '../../context/user/user'
import { Avdoed, Forelder, GjenlevendeForelder, PersonType } from './Person'
import { _test, hentForeldre } from './foreldreMapper'
import { fullAdresse } from '../../utils/personalia'

const EMPTY_VALUE = '-'

const user: User = {
    fornavn: 'STOR',
    etternavn: 'SNERK',
    foedselsnummer: '11057523044',
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
const isChild = false

describe('Generelle tester', () => {
    it('Mapping av søknad uten barn kaster feil', () => {
        expect.assertions(1)

        const application: IApplication = { aboutChildren: { children: [] }, aboutYou: {} }

        try {
            mapTilBarnepensjonSoeknadListe(t, application, user, isChild)
        } catch (e: any) {
            expect(e.message).toEqual('Kan ikke sende inn søknad med tom liste over barn!')
        }
    })

    it('Stopp mapping hvis bruker har ikke samtykket', () => {
        try {
            const application: IApplication = { aboutChildren: { children: [{}] }, aboutYou: {} }
            mapTilBarnepensjonSoeknadListe(t, application, user, isChild)
        } catch (e: any) {
            expect(e.message).toEqual('Kan ikke sende inn søknad uten å ha samtykket!')
        }
    })
})

describe('Gjenlevende forelder søker på vegne av barn', () => {
    // TODO: fullføre denne
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
            },
            aboutChildren: {
                children: [createChild('Blåøyd', 'Saks', '05111850870')],
            },
        }

        const soeknader = mapTilBarnepensjonSoeknadListe(t, application, user, isChild)

        expect(soeknader.length).toBe(1)

        const soeknad = soeknader[0]

        const foreldre = soeknad.foreldre!!
        expect(foreldre.length).toBe(2)

        const gjenlevende = foreldre[0] as GjenlevendeForelder
        expect(gjenlevende.fornavn.svar).toEqual(user.fornavn)
        expect(gjenlevende.etternavn.svar).toEqual(user.etternavn)
        expect(gjenlevende.foedselsnummer.svar).toEqual(user.foedselsnummer)
        expect(gjenlevende.statsborgerskap.svar).toEqual(user.statsborgerskap)
        expect(gjenlevende.adresse!!.svar).toEqual(fullAdresse(user))
        expect(gjenlevende.kontaktinfo.telefonnummer.svar.innhold).toEqual(user.telefonnummer)

        const secondParent = application.secondParent!! as IDeceasedParent
        const avdoed = foreldre[1] as Avdoed
        expect(avdoed.fornavn.svar).toEqual(secondParent.firstName)
        expect(avdoed.etternavn.svar).toEqual(secondParent.lastName)
        expect(avdoed.foedselsnummer.svar).toEqual(secondParent.fnrDnr)
        expect(avdoed.statsborgerskap.svar.innhold).toEqual(secondParent.citizenship)
        expect(avdoed.datoForDoedsfallet.svar.innhold).toEqual(secondParent.dateOfDeath)
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

    it('Mapping av gjenlevende forelder - mangler adresse og telefon', () => {
        const livingParent: ILivingParent = {
            ...createParent('Grønn', 'Kopp', '29018322402'),
        }

        const gjenlevende: GjenlevendeForelder = _test.mapGjenlevendeForelder(t, livingParent)
        expect(gjenlevende.fornavn.svar).toEqual(livingParent.firstName)
        expect(gjenlevende.etternavn.svar).toEqual(livingParent.lastName)
        expect(gjenlevende.foedselsnummer.svar).toEqual(livingParent.fnrDnr)
        expect(gjenlevende.statsborgerskap.svar).toEqual(livingParent.citizenship)
        expect(gjenlevende.kontaktinfo.telefonnummer.svar.innhold).toEqual(EMPTY_VALUE)
        expect(gjenlevende.adresse!!.svar).toEqual(EMPTY_VALUE)
    })

    it('Mapping av gjenlevende forelder - komplett med adresse og telefon', () => {
        const livingParent: ILivingParent = {
            ...createParent('Grønn', 'Kopp', '29018322402'),
            phoneNumber: '999 999 999',
            address: 'Testveien 13, 1234 Oslo',
        }

        const gjenlevende: GjenlevendeForelder = _test.mapGjenlevendeForelder(t, livingParent)
        expect(gjenlevende.fornavn.svar).toEqual(livingParent.firstName)
        expect(gjenlevende.etternavn.svar).toEqual(livingParent.lastName)
        expect(gjenlevende.foedselsnummer.svar).toEqual(livingParent.fnrDnr)
        expect(gjenlevende.statsborgerskap.svar).toEqual(livingParent.citizenship)
        expect(gjenlevende.kontaktinfo.telefonnummer.svar.innhold).toEqual(livingParent.phoneNumber)
        expect(gjenlevende.adresse!!.svar).toEqual(livingParent.address)
    })
})

describe('Utenlandsopphold mappes korrekt', () => {
    it('Utenlandsopphold - JA - mangler liste over land', () => {
        const result = _test.mapUtenlandsopphold(t, { hasStaysAbroad: JaNeiVetIkke.JA })
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.JA)
        expect(result.opplysning?.length).toEqual(0)
    })

    it('Utenlandsopphold - JA - med landliste', () => {
        const stayWithValues: IAbroadStay = {
            type: [OppholdUtlandType.ARBEIDET, OppholdUtlandType.BODD],
            pension: { amount: 'ukjent', currency: 'ISK' },
            toDate: new Date(1984, 1, 1),
            fromDate: new Date(1994, 1, 1),
            country: 'Sverige',
            medlemFolketrygd: JaNeiVetIkke.VET_IKKE,
        }
        const stayUndefinedValues: IAbroadStay = {
            type: [],
            country: 'Danmark',
            medlemFolketrygd: JaNeiVetIkke.NEI,
            pension: { amount: undefined, currency: undefined },
        }

        const staysAbroad: IStaysAbroad = {
            hasStaysAbroad: JaNeiVetIkke.JA,
            abroadStays: [stayWithValues, stayUndefinedValues],
        }

        const result = _test.mapUtenlandsopphold(t, staysAbroad)
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.JA)
        expect(result.opplysning?.length).toEqual(2)

        const opphold1 = result.opplysning!![0]
        expect(opphold1.oppholdsType.svar[0].verdi).toEqual(OppholdUtlandType.ARBEIDET)
        expect(opphold1.oppholdsType.svar[1].verdi).toEqual(OppholdUtlandType.BODD)
        expect(opphold1.pensjonsutbetaling?.svar.innhold).toEqual(
            `${stayWithValues.pension?.amount} ${stayWithValues.pension?.currency}`
        )
        expect(opphold1.fraDato?.svar.innhold).toEqual(stayWithValues.fromDate)
        expect(opphold1.tilDato?.svar.innhold).toEqual(stayWithValues.toDate)
        expect(opphold1.land?.svar.innhold).toEqual(stayWithValues.country)
        expect(opphold1.medlemFolketrygd?.svar.innhold).toEqual(stayWithValues.medlemFolketrygd)

        const opphold2 = result.opplysning!![1]
        expect(opphold2.oppholdsType.svar?.length).toEqual(0)
        expect(opphold2.pensjonsutbetaling?.svar.innhold).toEqual(undefined)
        expect(opphold2.fraDato?.svar.innhold).toBeUndefined()
        expect(opphold2.tilDato?.svar.innhold).toBeUndefined()
        expect(opphold2.land?.svar.innhold).toEqual(stayUndefinedValues.country)
        expect(opphold2.medlemFolketrygd?.svar.innhold).toEqual(stayUndefinedValues.medlemFolketrygd)
    })

    it('Utenlandsopphold - NEI', () => {
        const result = _test.mapUtenlandsopphold(t, { hasStaysAbroad: JaNeiVetIkke.NEI })
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.NEI)
        expect(result.opplysning).toBeUndefined()
    })

    it('Utenlandsopphold - VET_IKKE', () => {
        const result = _test.mapUtenlandsopphold(t, { hasStaysAbroad: JaNeiVetIkke.VET_IKKE })
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.VET_IKKE)
        expect(result.opplysning).toBeUndefined()
    })
})

describe('Næringsinntekt mappes korrekt', () => {
    it('Næringsinntekt - JA - uten detaljer', () => {
        const selfEmployment: ISelfEmployment = {
            wasSelfEmployed: JaNeiVetIkke.JA,
            selfEmplymentDetails: {
                incomeAtDeath: JaNeiVetIkke.VET_IKKE,
            },
        }

        const result = _test.mapNaeringsinntekt(t, selfEmployment)!!
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.JA)
        expect(result.opplysning?.naeringsinntektPrAarFoerDoedsfall?.svar.innhold).toEqual(EMPTY_VALUE)
        expect(result.opplysning?.naeringsinntektVedDoedsfall?.svar.innhold).toEqual(
            selfEmployment.selfEmplymentDetails.incomeAtDeath
        )
    })

    it('Næringsinntekt - JA - med detaljer', () => {
        const selfEmployment: ISelfEmployment = {
            wasSelfEmployed: JaNeiVetIkke.JA,
            selfEmplymentDetails: {
                income: '1111',
                incomeAtDeath: JaNeiVetIkke.JA,
            },
        }

        const result = _test.mapNaeringsinntekt(t, selfEmployment)!!
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.JA)
        expect(result.opplysning?.naeringsinntektPrAarFoerDoedsfall?.svar.innhold).toEqual(
            selfEmployment.selfEmplymentDetails.income
        )
        expect(result.opplysning?.naeringsinntektVedDoedsfall?.svar.innhold).toEqual(
            selfEmployment.selfEmplymentDetails.incomeAtDeath
        )
    })

    it('Næringsinntekt - NEI', () => {
        const selfEmployment: ISelfEmployment = {
            wasSelfEmployed: JaNeiVetIkke.NEI,
            selfEmplymentDetails: {},
        }

        const result = _test.mapNaeringsinntekt(t, selfEmployment)!!
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.NEI)
        expect(result.opplysning).toBeUndefined()
    })

    it('Næringsinntekt - VET_IKKE', () => {
        const selfEmployment: ISelfEmployment = {
            wasSelfEmployed: JaNeiVetIkke.VET_IKKE,
            selfEmplymentDetails: {},
        }

        const result = _test.mapNaeringsinntekt(t, selfEmployment)!!
        expect(result.svar.verdi).toEqual(JaNeiVetIkke.VET_IKKE)
        expect(result.opplysning).toBeUndefined()
    })
})

describe('Avdød mappes korrekt', () => {
    it('Generell sjekk på avdød mapping', () => {
        const parent: IDeceasedParent = {
            ...createParent('Grønn', 'Kopp', '29018322402'),
            dateOfDeath: new Date(2022, 1, 1),
            staysAbroad: {
                hasStaysAbroad: JaNeiVetIkke.VET_IKKE,
            },
            selfEmplyment: {
                wasSelfEmployed: JaNeiVetIkke.VET_IKKE,
                selfEmplymentDetails: {},
            },
            occupationalInjury: JaNeiVetIkke.VET_IKKE,
        }

        const result = _test.mapAvdoed(t, parent)

        expect(result.type).toBe(PersonType.AVDOED)
        expect(result.fornavn.svar).toBe(parent.firstName)
        expect(result.etternavn.svar).toBe(parent.lastName)
        expect(result.foedselsnummer.svar).toBe(parent.fnrDnr)
        expect(result.statsborgerskap.svar.innhold).toBe(parent.citizenship)
        expect(result.datoForDoedsfallet.svar.innhold).toBe(parent.dateOfDeath)

        // Separate tester for grundig sjekk av mapping på utenlandsopphold og næringsinntekt
        expect(result.utenlandsopphold.svar.verdi).toBe(parent.staysAbroad.hasStaysAbroad)
        expect(result.naeringsInntekt!!.svar.verdi).toBe(parent.selfEmplyment.wasSelfEmployed)
        expect(result.doedsaarsakSkyldesYrkesskadeEllerYrkessykdom.svar.verdi).toBe(parent.occupationalInjury)
    })
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
