import { login } from '@/api/user'
import { getToken, setToken, removeToken, getMenus, getUserName } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getUserName(),
    avatar: '',
    roles: [],// 添加权限控制
    menus: getMenus(),//菜单
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 添加权限控制
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  // 导航菜单
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      
      let tokenTest="aaaaaa";
      let userNoTest="admin";
      let menuFunListsTest= []; 
      commit('SET_NAME', userNoTest)
      commit('SET_TOKEN', tokenTest)
      commit('SET_MENUS', menuFunListsTest)

      localStorage.setItem("Menus", '[{}]')
      localStorage.setItem("UserName", userNoTest)

      setToken(tokenTest)
      
      resolve()
      return
      login({ UserNo: username.trim(), UserPwd: password }).then(response => {


        const { token, userNo, menuFunLists } = response
        commit('SET_NAME', userNo)
        commit('SET_TOKEN', token)
        commit('SET_MENUS', menuFunLists)

        localStorage.setItem("Menus", JSON.stringify(menuFunLists))
        localStorage.setItem("UserName", userNo)

        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }, 
 
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {

      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      commit('SET_ROLES', [])
      dispatch('tagsView/delAllViews', null, { root: true })

      dispatch('permission/resetRoutes', null, { root: true })

      localStorage.removeItem("Menus")
      localStorage.removeItem("UserName")

      resolve()




      // logout(state.token).then(() => {

      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

