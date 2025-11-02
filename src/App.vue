<script setup lang="ts">
import { computed } from 'vue';
import { useCv } from './composables/useCV';

const cv = useCv();

const links = computed(() => cv.value?.['x-links'] ?? []);
</script>

<template>
  <div class="min-h-screen flex justify-center px-6">
    <div
      class="w-full max-w-6xl lg:grid gap-y-8 lg:gap-y-0 gap-x-16 py-12
      lg:grid-cols-[225px,1fr] items-start font-['IBM_Plex_Sans']"
    >
      <!-- LEFT -->
      <!-- Sticky top matches container padding so columns align on desktop -->
      <aside class="self-start lg:sticky lg:top-12">
        <!-- Left-aligned on all viewports -->
        <div class="flex flex-col items-start gap-2">
          <div class="flex items-center gap-3">
            <img
              src="https://avatars.githubusercontent.com/u/51823781?v=4"
              :alt="cv?.profile.name"
              class="rounded-full w-10 h-10"
            />
            <h1 class="text-2xl font-semibold tracking-tight">Taariq Nazar</h1>
          </div>

          <p class="text-slate-600 text-md">{{ cv.profile.label }}</p>

          <ul class="mt-2 flex gap-2 text-slate-600 text-sm" >
            <li v-for="link in links" :key="link.href">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener"
                class="hover:text-slate-900 underline-offset-4 hover:underline
                hover:pointer"
              >{{ link.label }}</a>
            </li>
          </ul>

          <!-- Keep the divider only on desktop to reduce mobile spacing -->
          <hr class="my-3 w-full border-slate-100 hidden lg:block" />

          <nav aria-label="Primary" class="w-full mt-2 lg:mt-0">
            <ul class="flex lg:flex-col gap-2 text-slate-800 font-medium">
              <li>
                <router-link
                  to="/"
                  class="hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 rounded px-0.5"
                >Home</router-link>
              </li>
              <li>
                <router-link
                  to="/research"
                  class="hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 rounded px-0.5"
                >Research</router-link>
              </li>
              <li>
                <router-link
                  to="/cv"
                  class="hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 rounded px-0.5"
                >Curriculum Vitae</router-link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- RIGHT -->
      <!-- Use grid row gap on mobile; no extra margin needed -->
      <main class="text-slate-800 leading-7 max-w-[68ch] mt-4 lg:mt-0">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
.router-link-active {
  color: rgb(15 23 42); /* slate-900 */
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 6px;
}
</style>
