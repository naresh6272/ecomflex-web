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
      title: 'ECOMFLEX — Best Website Designer & Software Development Company in Bangalore',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'ECOMFLEX is a top-rated website designer and software development company in Bangalore, India — building enterprise platforms, e-commerce stores, custom web apps and AI-powered software for ambitious businesses.',
        },
        { name: 'theme-color', content: '#0a0a0f' },
        { property: 'og:title', content: 'ECOMFLEX — Best Website Designer & Software Development Company' },
        {
          property: 'og:description',
          content: 'Top-rated website designer and premium software development company in Bangalore, India. Enterprise platforms, e-commerce, custom software and AI solutions.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://ecomflex.in/' },
        { property: 'og:image', content: 'https://ecomflex.in/logo.png' },
        { property: 'og:site_name', content: 'ECOMFLEX' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ECOMFLEX — Best Website Designer & Software Development Company' },
        { name: 'twitter:description', content: 'Top-rated website designer and premium software development company in Bangalore, India.' },
        { name: 'twitter:image', content: 'https://ecomflex.in/logo.png' },
      ],
      script: [
        {
          // Default theme is light. Apply saved preference before first
          // paint — avoids a flash of the wrong theme for returning users
          // who explicitly switched to dark mode.
          children: `(function(){try{var t=localStorage.getItem('ecomflex-theme');if(t!=='dark'){document.documentElement.setAttribute('data-theme','light');}}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          type: 'text/javascript',
        },
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-4WETB42RRL',
          async: true,
        },
        {
          children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4WETB42RRL');`,
          type: 'text/javascript',
        },
        {
          // Force every hard reload/direct visit to land at the top of the home
          // page — strip any stale #hash immediately, disable the browser's
          // scroll restoration, and forcibly re-pin to top on load/pageshow as
          // a safety net (browsers can auto-scroll to an anchor before this
          // runs, or restore the old scroll position on reload).
          children: `(function(){
            if('scrollRestoration' in history){history.scrollRestoration='manual';}
            if(window.location.hash){history.replaceState(null,'',window.location.pathname+window.location.search);}
            window.scrollTo(0,0);
            var pin=function(){window.scrollTo(0,0);};
            window.addEventListener('load',pin);
            window.addEventListener('pageshow',pin);
          })();`,
          type: 'text/javascript',
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://ecomflex.in/#organization',
            name: 'ECOMFLEX',
            image: 'https://ecomflex.in/logo.png',
            url: 'https://ecomflex.in/',
            telephone: '+91-91486-25342',
            email: 'support@ecomflex.in',
            priceRange: '₹₹',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Lakshmipura Cross, Vaderahalli, K.G.Vaderahalli',
              addressLocality: 'Bangalore',
              addressRegion: 'Karnataka',
              postalCode: '560097',
              addressCountry: 'IN',
            },
            description:
              'ECOMFLEX is a premium website design and software development company in Bangalore offering enterprise platforms, e-commerce, custom web applications, and AI solutions.',
            sameAs: [
              'https://www.linkedin.com/in/ecom-flex-76157741b/',
              'https://www.instagram.com/ecomflex247/',
              'https://www.facebook.com/share/194Eg9jyxz/',
            ],
          }),
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://ecomflex.in/' },
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
