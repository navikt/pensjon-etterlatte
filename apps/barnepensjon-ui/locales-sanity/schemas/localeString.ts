const supportedLanguages = [
    { id: 'nb', title: 'Bokmål', isDefault: true },
    { id: 'nn', title: 'Nynorsk' },
    { id: 'en', title: 'English' }
]



export default {
    title: 'Localized string',
    name: 'localeString',
    type: 'object',
    fieldsets: [
        {
            title: 'Oversettelser',
            name: 'translations',
            option: { collapsible: true }
        }
    ],
    fields: supportedLanguages.map((lang) => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.isDefault ? null : 'translations', 
    }))
}