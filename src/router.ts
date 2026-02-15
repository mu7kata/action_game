import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/components/Home.vue'
import Battle from '@/components/Battle.vue'
import Select from '@/components/Select.vue'
import Thanks from './components/Thanks.vue'
import FreeSelect from './components/FreeSelect.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  },
  {
    path: '/free_select',
    name: 'FreeSelect',
    component: FreeSelect
  },
  {
    path: '/battle/:selectPlayerImgName/:enemyNum',
    name: 'Battle',
    component: Battle
  },
  {
    path: '/thanks/:gameResult',
    name: 'Thanks',
    component: Thanks
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
