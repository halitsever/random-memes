import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Faq from './components/Faq.vue'
import RandomMeme from './components/RandomMeme.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Faq', Faq)
    app.component('RandomMeme', RandomMeme)
  }
} satisfies Theme
