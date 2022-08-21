import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home"
import Battle from "@/components/Battle"
import Select from "@/components/Select"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },{
      path: '/select',
      name: 'Select',
      component: Select
    },
    {
      path: '/battle/:selectPlayerImgName',
      name: 'Battle',
      component: Battle
    }
  ]
})
