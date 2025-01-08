import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue'
import Research from './pages/Research.vue'
import Cv from './pages/CV.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/research', component: Research },
  { path: '/cv', component: Cv },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
