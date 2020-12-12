import 'dotenv/config'

export default {
    /*
    ** Build Modules
    */
    buildModules: ['@nuxt/typescript-build'],
    /*
    ** Headers of the page
    */
    head: {
        title: 'XKCD Viewer',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Nuxt.js project'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: 'https://nuxtjs.org/favicon.ico'}
        ]
    },
    css: [
        '~/assets/main.css'
    ],
    publicRuntimeConfig: {
        graphqlUrl: process.env.GRAPHQL_URL || 'http://localhost:4000/api/graphql',
        imagesUrl: process.env.IMAGES_URL || 'http://localhost:4000/api/images'
    }
}
