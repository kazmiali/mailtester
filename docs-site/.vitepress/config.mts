import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@mailtester/core',
  description: 'Modern, high-performance email validation for Node.js',
  
  base: '/mailtester/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/mailtester/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '@mailtester/core - Email Validation' }],
    ['meta', { property: 'og:description', content: 'Modern, high-performance email validation for Node.js' }],
    ['meta', { property: 'og:url', content: 'https://kazmiali.github.io/mailtester/' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API', link: '/api' },
      { text: 'Examples', link: '/examples' },
      {
        text: 'v1.0.2',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'npm', link: 'https://www.npmjs.com/package/@mailtester/core' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Why mailtester?', link: '/why' }
          ]
        },
        {
          text: 'Guide',
          items: [
            { text: 'API Reference', link: '/api' },
            { text: 'Validators', link: '/validators' },
            { text: 'Configuration', link: '/configuration' },
            { text: 'Examples', link: '/examples' }
          ]
        },
        {
          text: 'More',
          items: [
            { text: 'Changelog', link: '/changelog' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kazmiali/mailtester' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@mailtester/core' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/alikazmidev' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 <a href="https://alikazmi.dev" target="_blank" rel="noopener">Muhammad Ali Kazmi</a>'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/kazmiali/mailtester/edit/main/docs-site/:path',
      text: 'Edit this page on GitHub'
    }
  }
})

