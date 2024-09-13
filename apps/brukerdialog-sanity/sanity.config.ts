import { AuthConfig, defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const auth: AuthConfig = {
    redirectOnSingle: true,
    providers: () => [
        {
            name: 'saml',
            title: 'NAV SSO',
            url: 'https://api.sanity.io/v2021-10-01/auth/saml/login/f3270b37',
            logo: '/static/navlogo.svg',
        },
    ],
    loginMethod: 'dual',
}

export default defineConfig({
    name: 'default',
    title: 'test-sanity',

    projectId: 'u0dlg8d8',

    dataset: 'production',

    plugins: [structureTool(), visionTool()],
    auth: auth,

    schema: {
        types: schemaTypes,
    },
})
