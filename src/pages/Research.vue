<script setup lang="ts">
import { computed } from 'vue';
import { useCv } from '../composables/useCV';

const cv = useCv();


function yearOf(s?: string | null) {
  if (!s) return '';
  return s.slice(0, 4);
}

type Pub = {
  name: string;
  authors?: string[];
  publisher?: string;
  releaseDate?: string; // YYYY or YYYY-MM
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  ['x-status']?: string;       // e.g. "preprint"
  ['x-venuePublisher']?: string;
};

function joinAuthors(a?: string[]) {
  if (!a?.length) return '';
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]}, ${a[1]}`;
  return `${a.slice(0, -1).join(', ')}, ${a[a.length - 1]}`;
}

// Newest-first by releaseDate (fallback: keep order)
const publications = computed<Pub[]>(() => {
  const list = (cv.value?.publications ?? []).slice() as Pub[];
  const ts = (d?: string) => (d ? Date.parse(d.length === 4 ? `${d}-01-01` : d) : -Infinity);
  list.sort((a, b) => ts(b.releaseDate) - ts(a.releaseDate));
  return list;
});

</script>

<template>
    <section>
      <h2 class="text-lg font-semibold tracking-tight">Preprints &amp; Publications</h2>
      <div class="mt-3 grid gap-y-4">
        <div v-for="pub in publications" :key="pub.name" class="grid grid-cols-[9rem,1fr] gap-x-4">
          <div class="text-slate-500 tabular-nums">
            <span v-if="pub.releaseDate">{{ yearOf(pub.releaseDate) }}</span>
          </div>
          <p>
            <span class="text-slate-700">{{ joinAuthors(pub.authors) }}.</span>
            <span class="font-semibold"> {{ pub.name }}</span>.
            <template v-if="pub.publisher || pub['x-venuePublisher']">
              <em>, {{ pub['x-venuePublisher'] || pub.publisher }}</em>
            </template>
            <template v-if="pub.volume">
              , <span class="font-semibold">{{ pub.volume }}</span>
            </template>
            <template v-if="pub.issue"> ({{ pub.issue }})</template>
            <template v-if="pub.pages">, {{ pub.pages }}</template>
            <template v-if="pub['x-status'] === 'preprint'">
              <span class="text-slate-500"> (preprint)</span>
            </template>
            <template v-if="pub.url">
              . <a :href="pub.url" target="_blank" rel="noopener" class="underline text-slate-700 hover:text-slate-900">{{ pub.url }}</a>
            </template>
          </p>
        </div>
      </div>
    </section>
</template>
