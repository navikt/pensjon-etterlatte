import {createClient, type ClientConfig} from '@sanity/client'
import {useEffect, useState} from "react";

const config = {
    projectId: 'u0dlg8d8',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2024-06-27', // use current date (YYYY-MM-DD) to target the latest API version
    token: '' // TODO
}
const client = createClient(config)

const query = `*[_type == "veiledningstekst"]`
//const query = `array::unique(*[]._type)`

export async function fetchSanity() {
    return await client.fetch(query)
}
