import {supportedLanguages} from "../utils/lang";

const localeBlockContent = {
    title: "Localized content",
    name: "localeBlockContent",
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
        type: "blockContent",
        fieldset: lang.isDefault ? null : "translations",
    })),
};

export default localeBlockContent;
