import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: { host: '0.0.0.0', port: 4000 },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'ECOMFLEX — Premium Software Development Company',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'ECOMFLEX builds world-class software solutions — from enterprise platforms to AI-powered applications. We craft digital experiences that transform businesses.',
        },
        { name: 'theme-color', content: '#0a0a0f' },
        { property: 'og:title', content: 'ECOMFLEX — Premium Software Development' },
        {
          property: 'og:description',
          content: 'Premium software solutions for ambitious businesses.',
        },
        { property: 'og:type', content: 'website' },
      ],
      script: [
        {
          // Strip hash from URL immediately before browser scrolls to anchor
          children: `(function(){if(window.location.hash){history.replaceState(null,'',window.location.pathname+window.location.search);}if('scrollRestoration' in history){history.scrollRestoration='manual';}})();`,
          type: 'text/javascript',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap' },
      ],
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  experimental: {
    viewTransition: true,
  },
})
