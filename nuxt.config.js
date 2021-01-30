import bodyParser from "body-parser";

export default {
  mode: "universal",
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "WD Blog",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap" }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    "~assets/styles/main.css"
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~plugins/core-components.js",
    "~plugins/date-filter.js"
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  loading: {
    color: 'red',
    height: '4px'
  },
  env: {
    // baseUrl: process.env.BASE_URL || "https://nuxt-blog-f4cf3-default-rtdb.firebaseio.com"
    firebaseAPIKey: "AIzaSyAVohXRShlsEZkFviB2rjsO2ev242ZP6jE"
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  serverMiddleware: [
    bodyParser.json(),
    "~api"
  ]
}
