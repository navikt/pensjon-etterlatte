import { supportedLanguages } from "../utils/lang";

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