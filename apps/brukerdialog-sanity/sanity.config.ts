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
        name: 'inntektsjustering',
        title: 'Inntektsjustering',
        basePath: '/inntektsjustering',
        plugins: [structureTool(), visionTool()],
        auth,
        schema: {
            types: [...inntektsjusteringSchemaTypes],
        },
    },
    {
        projectId: 'u0dlg8d8',
        dataset: 'selvbetjening-ui',
        name: 'meld-inn-endring',
        title: 'Meld inn endring',
        basePath: '/meld-inn-endring',
        plugins: [structureTool(), visionTool()],
        auth,
        schema: {
            types: [],
        },
    },
    {
        projectId: 'u0dlg8d8',
        dataset: 'selvbetjening-ui',
        name: 'felleskomponenter',
        title: 'Felleskomponenter',
        basePath: '/felleskomponenter',
        plugins: [structureTool(), visionTool()],
        auth,
        schema: {
            types: [fantIkkeSidenSchemaType, systemUtilgjengeligSchemaType],
        },
    },
])
