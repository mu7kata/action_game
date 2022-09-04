import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home"
import Battle from "@/components/Battle"
import Select from "@/components/Select"
import Thanks from "./components/Thanks";
import FreeSelect from "./components/FreeSelect";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/select',
      name: 'Select',
      component: Select
    }, {
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
})
