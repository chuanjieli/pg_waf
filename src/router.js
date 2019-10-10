import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
// import Home from './views/Layout.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
    },
    {
      path: '/wafscreen/:site',
      name: 'wafscreen',
      component: () => import(/* webpackChunkName: "wafscreen" */ '@/views/WafScreen.vue'),
      meta: {
        requireAuth: true,
        roles: ['0']
      }
    },
    {
      path: '/user',
      redirect: '/user/changepwd',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/Layout.vue'),
      children: [{
        path: 'changepwd',
        name: 'changepwd',
        component: () => import(/* webpackChunkName: "changepwd" */ '@/views/Changepwd.vue'),
        meta: {
          requireAuth: true,
          name: 'application',
          roles: ['0', '1', '2']
        }
      }]
    },
    {
      path: '/normal',
      redirect: '/normal/home',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/Layout.vue'),
      children: [{
        path: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/normal/Home.vue'),
        meta: {
          requireAuth: true,
          name: 'home',
          roles: ['2']
        }
      },
      {
        path: 'weblist',
        name: 'weblist',
        component: () => import(/* webpackChunkName: "weblist" */ '@/views/normal/WebList.vue'),
        meta: {
          requireAuth: true,
          name: 'weblist',
          roles: ['2']
        }
      },
      {
        path: 'protectivereport/:domain/:date',
        name: 'protectivereport',
        component: () => import(/* webpackChunkName: "protectivereport" */ '@/views/normal/ProtectiveReport.vue'),
        meta: {
          requireAuth: true,
          name: 'weblist',
          roles: ['2']
        }
      },
      {
        path: 'accessreport/:domain/:date',
        name: 'accessreport',
        component: () => import(/* webpackChunkName: "accessreport" */ '@/views/normal/AccessReport.vue'),
        meta: {
          requireAuth: true,
          name: 'weblist',
          roles: ['2']
        }
      },
      {
        path: 'attacklogs',
        name: 'attacklogs',
        component: () => import(/* webpackChunkName: "attacklogs" */ '@/views/normal/AttackLogs.vue'),
        meta: {
          requireAuth: true,
          name: 'attacklogs',
          roles: ['2']
        }
      },
      {
        path: 'cclogs',
        name: 'cclogs',
        component: () => import(/* webpackChunkName: "cclogs" */ '@/views/normal/CcLogs.vue'),
        meta: {
          requireAuth: true,
          name: 'cclogs',
          roles: ['2']
        }
      },
      {
        path: 'scanlogs',
        name: 'scanlogs',
        component: () => import(/* webpackChunkName: "scanlogs" */ '@/views/normal/ScanLogs.vue'),
        meta: {
          requireAuth: true,
          name: 'scanlogs',
          roles: ['2']
        }
      },
      {
        path: 'accesslogs',
        name: 'accesslogs',
        component: () => import(/* webpackChunkName: "accesslogs" */ '@/views/normal/AccessLogs.vue'),
        meta: {
          requireAuth: true,
          name: 'accesslogs',
          roles: ['2']
        }
      },
      {
        path: 'logsdetail/:type/:id',
        name: 'logsdetail',
        component: () => import(/* webpackChunkName: "logsdetail" */ '@/views/normal/LogsDetail.vue'),
        meta: {
          requireAuth: true,
          roles: ['2']
        }
      }
      ]
    },
    {
      path: '/master',
      redirect: '/master/application',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/Layout.vue'),
      children: [{
        path: 'application',
        name: 'application',
        component: () => import(/* webpackChunkName: "application" */ '@/views/master/Application.vue'),
        meta: {
          requireAuth: true,
          name: 'application',
          roles: ['1']
        }
      },
      {
        path: 'appdetail/:id',
        name: 'appdetail',
        component: () => import(/* webpackChunkName: "appdetail" */ '@/views/master/Appdetail.vue'),
        meta: {
          requireAuth: true,
          name: 'application',
          roles: ['1']
        }
      },
      {
        path: 'waf',
        name: 'waf',
        component: () => import(/* webpackChunkName: "waf" */ '@/views/master/Waf.vue'),
        meta: {
          requireAuth: true,
          name: 'waf',
          roles: ['1']
        }
      },
      {
        path: 'wafdetail/:id',
        name: 'wafdetail',
        component: () => import(/* webpackChunkName: "wafdetail" */ '@/views/master/Wafdetail.vue'),
        meta: {
          requireAuth: true,
          name: 'waf',
          roles: ['1']
        }
      },
      {
        path: 'cc',
        name: 'cc',
        component: () => import(/* webpackChunkName: "cc" */ '@/views/master/Cc.vue'),
        meta: {
          requireAuth: true,
          name: 'cc',
          roles: ['1']
        }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/master/Users.vue'),
        meta: {
          requireAuth: true,
          name: 'users',
          roles: ['1']
        }
      },
      {
        path: 'userdetail/:id',
        name: 'userdetail',
        component: () => import(/* webpackChunkName: "userdetail" */ '@/views/master/Userdetail.vue'),
        meta: {
          requireAuth: true,
          name: 'users',
          roles: ['1']
        }
      }
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import(/* wabpackChunkName:"notfound" */ '@/views/notfound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.lastIndexOf('logs') === (to.path.length - 4)) {
    store.commit('setKeepAlive', [to.name])
  }
  store.commit('clearToken') // 取消请求
  if (to.path.startsWith('/login')) {
    localStorage.removeItem('user')
    localStorage.removeItem('Authorization')
    next()
  } else {
    let token = localStorage.getItem('Authorization')
    let role = localStorage.getItem('role')
    if (token === null || token === '' || role === '') {
      next('/login')
    } else {
      if (to.meta.roles) {
        if (to.meta.roles.length !== 0) {
          for (let i = 0; i < to.meta.roles.length; i++) {
            if (role === to.meta.roles[i]) {
              next()
              break
            }
          }
        }
      } else {
        next()
      }
    }
  }
})
export default router
