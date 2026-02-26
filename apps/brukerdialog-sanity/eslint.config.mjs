import sanityEslint from '@sanity/eslint-config-studio'

export default [
    ...sanityEslint,
    {
        settings: {
            react: { version: '19' }, // Avoids auto-detection crash
        },
    },
]
