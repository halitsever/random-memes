import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Random Memes",
  description: "🌁 Random meme genarator package with reddit & custom api support",
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],

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
          { text: 'reddit()', link: '/reddit' }

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/random-memes' }
    ]
  }
})
