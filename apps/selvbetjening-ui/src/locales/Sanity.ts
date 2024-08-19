import { createClient } from '@sanity/client'

const config = {
    projectId: 'u0dlg8d8',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2024-06-27', // use current date (YYYY-MM-DD) to target the latest API version
    token: 'sktKaMVrt2ukai3cLjyPFbSAmL91LItBnCT7ynPlG1ooGjiscUbQF8gp0mSArHur6C3UzbehKLHOIUfls6F5TqhDZfjMy7pOLhwvqXjp1I4GhcDAgotMwFUI13jjSb8Rf2i1mkVr5da29fjzRhg58AQVmX5FADpxrryyPJEjrTCEczTiGiwK', // TODO
}
const client = createClient(config)

const query = `*[_type == "veiledningstekst"]`
//const query = `array::unique(*[]._type)`

export async function fetchSanity() {
    return await client.fetch(query)
}
