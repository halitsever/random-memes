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

const author = { '@type': 'Person', name: 'Halit Sever', url: 'https://halit.org' }
const blog: [string, string][] = [
  ['reddit-api-key', 'Get a Reddit API key'],
  ['is-reddit-api-free', 'Is the Reddit API free?'],
  ['discord-meme-bot', 'Discord meme bot'],
  ['lemmy-vs-reddit', 'Lemmy vs Reddit'],
  ['lemmy-api', 'Lemmy API in JavaScript'],
  ['meme-generator-api', 'Meme generator API vs random meme API'],
  ['lemmy-nsfw-filter', 'Filter NSFW posts from Lemmy'],
  ['random-memes-cli', 'Random memes in the terminal'],
  ['reddit-alternatives', 'Reddit alternatives'],
  ['promise-allsettled', 'Promise.all vs Promise.allSettled'],
  ['commonjs-vs-esm', 'CommonJS vs ESM'],
  ['node-test-runner-mock-fetch', 'Mock fetch with node:test'],
  ['javascript-fetch-timeout', 'JavaScript fetch timeout'],
  ['fetch-user-agent', 'User-Agent in fetch']
]

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
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    const url = siteUrl + path
    const graph: Record<string, unknown>[] = []
    const heading = pageData.frontmatter.title ?? pageData.title
    if (path.startsWith('blog/') && path !== 'blog/') {
      graph.push(
        { '@type': 'BlogPosting', headline: heading, description: pageDescription, url, mainEntityOfPage: url, image: `${siteUrl}og.png`, inLanguage: 'en-US', datePublished: pageData.frontmatter.date, dateModified: pageData.frontmatter.date, author, publisher: author },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Random Memes', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}blog/` },
            { '@type': 'ListItem', position: 3, name: heading, item: url }
          ]
        }
      )
    } else if (path === 'blog/') {
      graph.push({ '@type': 'Blog', name: 'Random Memes blog', description: pageDescription, url, inLanguage: 'en-US', author })
    } else if (path === 'random-meme/') {
      graph.push({ '@type': 'WebPage', name: heading, description: pageDescription, url, inLanguage: 'en-US' })
    }
    const faq = pageData.frontmatter.faq as { q: string; a: string }[] | undefined
    if (faq?.length) {
      graph.push({ '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })
    }
    const extra: [string, Record<string, string>, string][] = graph.length
      ? [['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })]]
      : []
    return [
      ...extra,
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
      { text: 'Random meme', link: '/random-meme/' },
      { text: 'Guide', link: '/usage' },
      { text: 'Blog', link: '/blog/' }
    ],

    sidebar: {
      '/blog/': [
        { text: 'Blog', items: [{ text: 'All posts', link: '/blog/' }, ...blog.map(([slug, text]) => ({ text, link: `/blog/${slug}` }))] },
        { text: 'Random Memes', items: [{ text: 'Random meme', link: '/random-meme/' }, { text: 'Usage', link: '/usage' }, { text: 'Meme API as JSON', link: '/meme-api' }] }
      ],
      '/': [
      {
        text: 'Guide',
        items: [
          { text: 'Usage', link: '/usage' },
          { text: 'random()', link: '/random' },
          { text: 'Meme API as JSON', link: '/meme-api' },
          { text: 'reddit() (deprecated)', link: '/reddit' }

        ]
      }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/random-memes' }
    ]
  }
})
