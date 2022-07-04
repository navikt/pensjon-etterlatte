import sanityClient from '@sanity/client';

// const client = sanityClient({
//     projectId: '57rxrfr3',
//     dataset: 'production'
// })

const apiPath =(query: string): string => 'https://57rxrfr3.api.sanity.io/v2021-03-25/data/query/production?query=' + query

const lang = localStorage.getItem('language')

// export const getFrontPage = async () => {
//     return await client.fetch(frontPageGroq).then( (data) => {
//         return data;
//     } )
// }


export const getFrontPage = async () => {
    return await fetch(apiPath(frontPageGroq)).then((res) =>{
        return res.json()
    })
}


const frontPageGroq = `*[_type == "frontpage"]`;

export const getContext = () => {
    return localStorage.getItem('language');
}

export const filterLocaleData = (data: any) => {
    for (let [key, value] of Object.entries(data)) {
        console.log(`${key}: ${value}`);
    }
}

export const returnText = (data: any) => {
    if (lang === 'nn') return data.nn
    else if (lang === 'nb') return data.nb
    else return data.en
}
