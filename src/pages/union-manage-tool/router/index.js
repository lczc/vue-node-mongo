let _import = index => {
  return import(/* webpackChunkName: 'demo' */ '@/pages/union-manage-tool/views/' +
    index)
}
export default [

  {
    path: '/demo',
    component() {
      return _import('index/index')
    },
    name: 'demo',
    meta: {
      title: '消息模板'
    }
  },
  {
    path: '/home',
    component() {
      return _import('home/home')
    },
    name: 'home',
    meta: {
      title: '主页'
    }
  },
  {
    path: '/login',
    component() {
      return _import('login/login')
    },
    name: 'Login',
    meta: {
      title: '登录'
    }
  }
]
