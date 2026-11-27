import { defineConfig } from 'vitepress'

const siteUrl = 'https://projects.halit.org/random-memes/'
const description = 'Random meme API for Node.js with a CLI and TypeScript types. Fetches random meme images from Lemmy communities, with zero dependencies.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'random-memes',
  description,
  url: siteUrl,
  codeRepository: 'https://github.com/halitsever/random-memes',
  programmingLanguage: 'JavaScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
  author: { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  /** keeps the page hash map out of every page's HTML, which Semrush reads as a low text-to-HTML ratio */
  metaChunk: true,
  lang: 'en-US',
  title: "Random Memes",
  description,
  head: [
    /** Cloudflare Web Analytics, one token for every page on projects.halit.org. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/random-memes/favicon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Random Memes' }],
    ['meta', { property: 'og:image', content: `${siteUrl}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}og.png` }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)]
  ],
  base: '/random-memes/',
  sitemap: { hostname: siteUrl },
  transformHead({ pageData, title, description: pageDescription }) {
    if (pageData.isNotFound) return
    const url = siteUrl + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageDescription }]
    ]
  },
  themeConfig: {

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/usage' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Usage', link: '/usage' },
          { text: 'random()', link: '/random' },
          { text: 'Meme API as JSON', link: '/meme-api' },
          { text: 'reddit() (deprecated)', link: '/reddit' }

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/random-memes' }
    ]
  }
})
