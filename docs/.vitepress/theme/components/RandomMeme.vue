<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type Meme = { image: string; caption: string; category: string; permalink: string; instance: string }

/** The same communities and filters as random() in src/lib/random.js. */
const SOURCES = [
  { instance: 'https://lemmy.world', community: 'memes' },
  { instance: 'https://lemmy.world', community: 'dankmemes' },
  { instance: 'https://lemmy.ml', community: 'memes' }
]
const IMAGE_EXTENSION = /\.(jpe?g|png|gif|webp)$/i

const isImageUrl = (url: string) => {
  try {
    return IMAGE_EXTENSION.test(new URL(url).pathname)
  } catch {
    return false
  }
}

const isUsable = ({ post, community }: any) =>
  isImageUrl(post.url) && !post.nsfw && !community.nsfw && !post.removed && !post.deleted && !post.featured_community && !post.featured_local

const state = ref<'loading' | 'ready' | 'error'>('loading')
const pool = ref<Meme[]>([])
const index = ref(0)
const meme = computed(() => pool.value[index.value])
const host = (url: string) => new URL(url).host

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

async function fetchSource({ instance, community }: (typeof SOURCES)[number]): Promise<Meme[]> {
  const response = await fetch(`${instance}/api/v3/post/list?community_name=${community}&sort=Hot&limit=50`, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const { posts } = await response.json()
  return posts.filter(isUsable).map(({ post, community: c }: any) => ({ image: post.url, caption: post.name, category: c.name, permalink: post.ap_id, instance }))
}

async function load() {
  state.value = 'loading'
  const results = await Promise.allSettled(SOURCES.map(fetchSource))
  // Cross-posts show up in several communities with the same image.
  const byImage = new Map<string, Meme>()
  for (const result of results) if (result.status === 'fulfilled') for (const m of result.value) byImage.set(m.image, m)
  if (byImage.size === 0) {
    state.value = 'error'
    return
  }
  pool.value = shuffle([...byImage.values()])
  index.value = 0
  state.value = 'ready'
}

function next() {
  if (!pool.value.length) return
  if (index.value + 1 < pool.value.length) index.value++
  else {
    pool.value = shuffle(pool.value.slice())
    index.value = 0
  }
}

/** A dead image link skips to the next meme instead of leaving a broken frame. */
function onImageError() {
  pool.value.splice(index.value, 1)
  if (!pool.value.length) state.value = 'error'
  else if (index.value >= pool.value.length) index.value = 0
}

onMounted(load)
</script>

<template>
  <div class="meme-box">
    <div v-if="state === 'loading'" class="meme-frame meme-loading" role="status">Loading memes from Lemmy…</div>

    <div v-else-if="state === 'error'" class="meme-frame meme-error" role="alert">
      <p><strong>No memes right now.</strong> The Lemmy communities this page reads from did not answer, or returned no image posts. This sometimes happens when an instance is busy.</p>
      <button type="button" class="meme-btn" @click="load">Try again</button>
    </div>

    <figure v-else-if="meme" class="meme-figure">
      <a :href="meme.permalink" class="meme-frame" target="_blank" rel="noopener nofollow ugc">
        <img :key="meme.image" :src="meme.image" :alt="meme.caption" referrerpolicy="no-referrer" @error="onImageError" />
      </a>
      <figcaption>
        <span class="meme-caption">{{ meme.caption }}</span>
        <span class="meme-source">c/{{ meme.category }} on {{ host(meme.instance) }}</span>
      </figcaption>
      <div class="meme-actions">
        <button type="button" class="meme-btn" @click="next">Next meme</button>
        <a class="meme-link" :href="meme.permalink" target="_blank" rel="noopener nofollow ugc">Open the post</a>
        <a class="meme-link" :href="meme.permalink" target="_blank" rel="noopener nofollow ugc" title="Reporting needs a Lemmy account on any instance">Report it on Lemmy</a>
      </div>
    </figure>
  </div>
</template>

<style scoped>
.meme-box {
  margin: 24px 0 32px;
}

.meme-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
}

.meme-frame img {
  display: block;
  max-width: 100%;
  max-height: 70vh;
  height: auto;
  border-radius: 6px;
}

.meme-loading {
  color: var(--vp-c-text-2);
}

.meme-error {
  flex-direction: column;
  gap: 12px;
  text-align: center;
}

.meme-error p {
  margin: 0;
  max-width: 460px;
}

.meme-figure {
  margin: 0;
}

figcaption {
  display: grid;
  gap: 4px;
  margin-top: 12px;
}

.meme-caption {
  font-size: 17px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.meme-source {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.meme-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin-top: 16px;
}

.meme-btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
  cursor: pointer;
}

.meme-btn:hover {
  background: var(--vp-button-brand-hover-bg);
}

.meme-link {
  font-size: 14px;
}
</style>
