import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue'
import Research from './pages/Research.vue'
import Cv from './pages/CV.vue'

const routes = [
  { path: '/', name:"Home", component: Home },
  { path: '/research', name: "Research", component: Research },
  { path: '/cv', name:"CV", component: Cv },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
