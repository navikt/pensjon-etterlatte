import { createClient } from '@sanity/client'
import exportDataset from "@sanity/export";

const exportSelvbetjeningUISanityDataset = async () => {
    const client = createClient({
        projectId: 'u0dlg8d8',
        dataset: 'selvbetjening-ui',
        token: process.env.SANITY_AUTH_TOKEN
    })

    await exportDataset({
        client,
        dataset: 'sevbetjening-ui',
        outputPath: `backup-selvbetjening-ui-${Date.now()}.tar.gz`,
        assets: true,
        raw: false,
        assetConcurrency: 12,
    })
}

exportSelvbetjeningUISanityDataset()