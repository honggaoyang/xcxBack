import { asyncRoutes, constantRoutes } from '@/router'
import { getMenus, } from '@/utils/auth'
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法

import Layout from '@/layout'



export function generateTree(data, parentId) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].PID === parentId) {
      let node = {
        path: data[i].Path,
        component: data[i].component == "Layout" ? Layout : _import(data[i].component),
        name: data[i].name,
        meta: { title: data[i].Title, icon: data[i].Icon },
        redirect: data[i].Redirect,
        alwaysShow: data[i].AlwaysShow,
        children: generateTree(data, data[i].ID)
      };

      if (!node.meta.title) {
        delete node.meta
      }

      if (node.children.length == 0) {
        delete node.children
      }

      if (!node.redirect) {
        delete node.redirect
      }

      if (!node.name) {
        delete node.name
      }
      result.push(node);
    }
  }
  return result;
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },

  RESET_ROUTES: (state, value) => {
    state.addRoutes = value
    state.routes = value
  }
}

const actions = {
  resetRoutes({ commit }) {
    commit('RESET_ROUTES', [])
  },
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const routes = getMenus();
      const asyncRoutes = generateTree(routes, 0) // 对路由格式进行处理

      commit('SET_ROUTES', asyncRoutes)
      resolve(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
