import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'mailtester',
  titleTemplate: ':title — mailtester | Node.js Email Validation',
  description: 'Fast, lightweight Node.js email validation library. Validates format (RFC 5322), detects typos, blocks disposable emails, checks MX records & SMTP. TypeScript-first. 25KB gzipped.',

  base: '/',

  sitemap: {
    hostname: 'https://mailtester.alikazmi.dev'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'google-site-verification', content: 'tgwMGsiNBR4Z1ayY2eN4axCmmYTy8_lNgrvk_KX8KFE' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { name: 'keywords', content: 'nodejs email validation, email validator npm, typescript email validation, smtp email verification nodejs, disposable email detection, mx record check, bulk email validation, rfc 5322 email regex' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'mailtester' }],
    ['meta', { property: 'og:title', content: 'mailtester — Node.js Email Validation Library' }],
    ['meta', { property: 'og:description', content: 'Fast, lightweight Node.js email validation. Detect typos, block disposable emails, verify MX & SMTP. TypeScript-first. 25KB.' }],
    ['meta', { property: 'og:url', content: 'https://mailtester.alikazmi.dev/' }],
    ['meta', { property: 'og:image', content: 'https://mailtester.alikazmi.dev/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    // Twitter / X
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@alikazmidev' }],
    ['meta', { name: 'twitter:title', content: 'mailtester — Node.js Email Validation Library' }],
    ['meta', { name: 'twitter:description', content: 'Fast, lightweight Node.js email validation. Detect typos, block disposable emails, verify MX & SMTP. TypeScript-first. 25KB.' }],
    ['meta', { name: 'twitter:image', content: 'https://mailtester.alikazmi.dev/og-image.png' }],
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

