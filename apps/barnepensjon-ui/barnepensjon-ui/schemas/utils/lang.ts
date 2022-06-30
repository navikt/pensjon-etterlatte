export const supportedLanguages = [
    {id: "nb", title: "Bokmål", isDefault: true},
    {id: "nn", title: "Nynorsk"},
    {id: "en", title: "English"},
];

export const defaultLanguage = supportedLanguages.find((l) => l.isDefault);
