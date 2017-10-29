import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import CustomerEdit from '@/components/CustomerEdit'
import CustomerList from '@/components/CustomerList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CustomerList',
      component: CustomerList
    },
    {
      path: '/CustomerEdit/:id',
      name: 'CustomerEdit',
      component: CustomerEdit
    },
    {
      path: '/Hello',
      name: 'Hello',
      component: HelloWorld
    }
  ]
})
