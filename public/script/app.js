// Setup the connection to the CMS
const contentfulClient = contentful.createClient({
  accessToken: '64d6a750c7ae5a7c93603911e56166b198ce5ab94be05261848e8a280ba8972c',
  space: '7la5sjify8om'
})

// 1. Define route components.
// These can be imported from other files

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { path: '/map/:mapstyle', component: Vue.component("google-map"),  props: true},
    { path: '/details/:id', component: Vue.component("details-page"),  props: true},
    // catch all redirect
    { path: '*', redirect: '/map/default' }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router
}).$mount('#app')

