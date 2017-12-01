import Vue from 'vue'
import Router from 'vue-router'
// import vMap from '@@/map/Map'
import vContent from '@@/content/Content'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  linkActiveClass: 'router-active',
  routes: [
    {
      path: '/content/:catType',
      name: 'content',
      component: vContent
    }
  ]
})
