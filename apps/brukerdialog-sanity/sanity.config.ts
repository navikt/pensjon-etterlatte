import { AuthConfig, defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { inntektsjusteringSchemaTypes } from './schemaTypes/inntektsjustering'
import { fantIkkeSidenSchemaType } from './schemaTypes/fantIkkeSidenSchemaType'
import { systemUtilgjengeligSchemaType } from './schemaTypes/systemUtilgjengeligSchemaType'

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

export default defineConfig([
    {
        projectId: 'u0dlg8d8',
        dataset: 'selvbetjening-ui',
        name: 'selvbetjening-ui',
        title: 'Selvbetjening',
        basePath: '/selvbetjening-ui',
        plugins: [structureTool(), visionTool()],
        auth: auth,
        schema: {
            types: [...inntektsjusteringSchemaTypes, fantIkkeSidenSchemaType, systemUtilgjengeligSchemaType],
        },
    },
])
