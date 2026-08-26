// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  srcDir: 'app/',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  ui: {
    fonts: false
  },
  fonts: {
    provider: 'none'
  },
  colorMode: {
    preference: 'light'
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&f[]=clash-display@200,400,700,500,600,300&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
})
