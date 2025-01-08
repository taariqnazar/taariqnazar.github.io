<script setup>
import { ref } from 'vue'

const citations = ref([{ 
    authors: "Lindholm, M., Nazar, T.",
    title: "On duration effects in non-life insurance pricing",
    journal: "European Actuarial Journal",
    volume: 14,
    pages: "809–832",
    year: 2024,
    doi: "10.1007/s13385-024-00385-5",
}])
</script>

<template>

  <h1 class="text-xl font-bold">Preprints & Publications</h1>
  <ul>
    <li
      class="citation text-sm leading-relaxed text-gray-700"
      v-for="(citation, index) in citations" :key="index"
    >
      <span>{{ citation.authors }}</span>
      <span class="font-semibold">{{ citation.title }}.</span>
      <i class="text-gray-600">{{ citation.journal }}</i>,
      <span>{{ citation.volume }}</span>,
      <span>{{ citation.pages }}</span>
      <span>({{ citation.year }}).</span>
      <a
        :href="`https://doi.org/${citation.doi}`"
        class="text-blue-600 underline hover:text-blue-800"
        target="_blank"
      >
        https://doi.org/{{ citation.doi }}
      </a>
    </li>
  </ul>
</template>
