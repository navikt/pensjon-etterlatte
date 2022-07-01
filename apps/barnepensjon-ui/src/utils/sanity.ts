import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: '57rxrfr3',
    dataset: 'production'
})


export const getFrontPage = async () => {
    return await client.fetch(frontPageGroq).then( (data) => {
        return data;
    } )
}

const frontPageGroq = `*[_type == "frontpage"]`;

export const getContext = () => {
    return localStorage.getItem('language');
}
