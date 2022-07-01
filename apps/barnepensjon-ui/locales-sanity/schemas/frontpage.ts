export default {
    name: 'frontpage',
    title: 'Forside',
    type: 'document',
    fields: [
         {
            name: "metaDescription",
            title: "Metabeskrivelse",
            type: "localeString",
            description:
                "Søkemotorer kan bruke denne teksten i søkeresultater. Kan i de fleste tilfeller være tom, da Google etc helst genererer egne tekster basert på innholdet på siden",
        },
        {
            name: 'frontPageTitle',
            title: 'Fremsidetittel',
            type: 'localeString',
            description:
                'Tittelen på fremsiden av søknaden.'
        },
        {
            name: 'helloUser',
            title: 'brukerhilsen',
            type: 'localeString',
            description:
                'En hilsning til brukeren, ofte i format hei, {fornavn} {etternavn}'
        },
        {
            name: 'childMayBeApplicableForPension',
            title: 'Brødtekst hvem kan søke',
            type: 'localeString',
            description:
                'Tittelen på fremsiden av søknaden.'
        },
        {
            name: 'childMayBeApplicableForPension_bullets',
            title: 'Kulepunkt',
            type: 'array',
            of: [{type: 'localeString'}]
        },
        {
            name: 'childOver18HasToApplyByThemself',
            title: 'Barn over 18 må søke selv',
            type: 'localeString',
        },
        
        {
            name: 'tax',
            title: 'Skatt',
            type: 'localeString',
            description:
                'overskrift på skattesegmentet'
        },
        {
            name: 'aboutChildrensPensionTax',
            title: 'brødtekst',
            type: 'localeString',
            description:
                'brødtekst på barnepensjonsskatten'
        },
        {
            name: 'weWillRetrieveInfo',
            title: 'Overskrift infohenting.',
            type: 'localeString',
        },
        {
            name: 'infoWeRetrieve',
            title: 'brødtekst',
            type: 'localeString',
            description:
                'brødtekst på informasjonshenting'
        },
        {
            name: 'infoWeRetrieve_bullets',
            title: 'brødtekst',
            type: 'array',
            of: [{type: 'localeString'}]
        },
        {
            name: 'howWeHandleData',
            title: 'Hvordan håndterer vi data (lenke)',
            type: 'url',
            description:
                'lenken til hvordan vi håndterer personopplysninger'
        },
        {
            name: 'howWeHandleDataText',
            title: 'Lenketekst',
            type: 'localeString',
            description:
                'Teksten som vil vises istedenfor lenke til hvordan vi håndterer personopplysninger'
        },
        {
            name: 'aboutPrivacy',
            title: 'Hvordan håndterer vi personvern (lenke)',
            type: 'url',
            description:
                'Lenke til hvordan vi håndterer personvern og sikkerhet'
        },
        {
            name: 'aboutPrivacyText',
            title: 'Lenketekst',
            type: 'localeString',
            description:
                'Teksten som vil vises istedenfor lenke til om personvern'
        },
        {
            name: 'aboutTheApplicationTitle',
            title: 'Om utfylling av søknaden',
            type: 'localeString',
            description:
                'tittel for avsnitt om utfylling'
        },
        {
            name: 'aboutTheApplicationDescription',
            title: 'brødtekst om utfylling',
            type: 'localeString',
        },
        {
            name: 'consentTitle',
            title: 'Samtykke Tittel',
            type: 'localeString',
            description:
                'Knapp for starting av søknad.'
        },
        {
            name: 'consentDescription',
            title: 'Samtykke beskrivelse',
            type: 'localeString',
        },
        {
            name: 'consentToNav',
            title: 'jeg gir samtykke',
            type: 'localeString',
            description:
                'Teksten som vises ved boksen for å gi samtykke'
        },
        {
            name: 'startApplication',
            title: 'Start søknad',
            type: 'localeString',
            description:
                'Knapp for starting av søknad.'
        },
    ]
}
