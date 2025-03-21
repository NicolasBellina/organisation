// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
  ],

  css: ['~/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  supabase: {
    url: 'https://gyqqifqlxygnmfwqxekl.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cXFpZnFseHlnbm1md3F4ZWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDM4NDgsImV4cCI6MjA1Nzc3OTg0OH0.BTsrAYLtxCz8bOGjSeDatD7nZVfVd14jY5-ZsGxIOB4',
    redirect: false
  },

  compatibilityDate: '2025-03-20',

  nitro: {
    moduleSideEffects: ['punycode']
  }
})