<script setup lang="ts">
import { computed } from 'vue';
import { useCv } from '../composables/useCV';

const cv = useCv();

</script>

<template>
  <section v-if="cv">

    <p class="mt-4 max-w-prose">{{ cv.summary }}</p>

    <p class="mt-6 max-w-prose text-sm text-neutral-600 dark:text-neutral-400">
      <span class="mr-2">Reach me at:</span>
      <a :href="`mailto:${cv.profile.email}`" class="font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid">
        <span class="[unicode-bidi:bidi-override] [direction:rtl]">
          {{ cv.profile.email.split('').reverse().join('') }}
        </span>
      </a>
    </p>


  </section>
</template>
