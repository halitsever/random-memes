<script setup lang="ts">
import { useData } from 'vitepress'

/** Renders the frontmatter `faq` list, the same list config.mts turns into FAQPage data. */
const { frontmatter } = useData()
</script>

<template>
  <div class="faq">
    <template v-for="item in frontmatter.faq" :key="item.q">
      <h3>{{ item.q }}</h3>
      <p>{{ item.a }}</p>
    </template>
  </div>
</template>
