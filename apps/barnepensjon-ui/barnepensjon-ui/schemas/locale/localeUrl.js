import {supportedLanguages} from "../utils/lang";

const localeUrl = {
    title: "Localized URL",
    name: "localeUrl",
    type: "object",
    fieldsets: [
        {
            title: "Oversettelser",
            name: "translations",
            options: {collapsible: true},
        },
    ],
    fields: supportedLanguages.map((lang) => ({
        title: lang.title,
        name: lang.id,
        type: "url",
        fieldset: lang.isDefault ? null : "translations",
    })),
};

export default localeUrl;
