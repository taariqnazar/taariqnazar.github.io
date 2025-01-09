<script setup>
</script>

<template>
  <div class="container h-screen flex items-center justify-center
    max-w-screen-sm w-full  mx-auto
    font-['Source_Code_Pro']
    ">
    <div class="absolute top-[30vh]">
      <div class="flex flex-col sm:flex-row">
        <img src="https://avatars.githubusercontent.com/u/51823781?v=4"
          alt="taariq nazar" class="rounded-full w-20 h-20 mb-3">
        <div class="my-auto sm:text-center sm:ml-3">
          <h1 class="text-4xl font-bold">Taariq Nazar</h1>
        </div>
      </div>

      <ul class="text-slate-600 flex space-x-4 my-3 font-semibold">
        <!---
        <li class="hover:font-bold">
          <a href="/articles">
            Articles
          </a>
        </li>
        -->
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/research">Research</router-link></li>
        <li><router-link to="/cv">Curriculum Vitae</router-link> </li>
      </ul>

      <div class="max-w-md my-3">
        <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="route.path" />
        </router-view>
      </div>
    </div>
  </div>
</template>

