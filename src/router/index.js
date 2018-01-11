import Vue from 'vue'
import Router from 'vue-router'
// import vMap from '@@/map/Map'
import vContent from '@@/content/Content'
import Sharing from '@@/sharing/Sharing'
import Passenger from '@@/sharing/Passenger'
import Driver from '@@/sharing/Driver'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  linkActiveClass: 'router-active',
  routes: [
    {
      path: '/sharing',
      name: 'sharing',
      redirect: '/sharing/passenger',
      component: Sharing,
      children: [
        {
          path: 'passenger',
          name: 'passenger',
          component: Passenger
        },
        {
          path: 'driver',
          name: 'driver',
          component: Driver
        }
      ]
    },
    {
      path: '/:catType',
      name: 'content',
      component: vContent
    }
  ]
})
