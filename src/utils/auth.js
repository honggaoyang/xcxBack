import Cookies from 'js-cookie'

const TokenKey = 'mx_website_backend_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getMenus() {
  return JSON.parse(localStorage.getItem("Menus"))
}


export function getUserName() {
  return localStorage.getItem("UserName")
}
