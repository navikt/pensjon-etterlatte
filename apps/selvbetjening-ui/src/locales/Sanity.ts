import {createClient, type ClientConfig} from '@sanity/client'
import {useEffect, useState} from "react";

const config = {
    projectId: 'be3kt9kl',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2024-06-27', // use current date (YYYY-MM-DD) to target the latest API version
    token: '' // TODO
}
const client = createClient(config)

const query = `*[_type == "event"]`
//const query = `array::unique(*[]._type)`

export async function fetchSanity() {
    return await client.fetch(query)
}
