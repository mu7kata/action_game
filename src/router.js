import Vue from 'vue'
import Router from 'vue-router'
import Battle from "@/components/Battle"
import Select from "@/components/Select"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/select',
      name: 'Select',
      component: Select
    },
    {
      path: '/battle/:playerName',
      name: 'Battle',
      component: Battle
    }
  ]
})
