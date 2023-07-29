import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Users/Login',
    method: 'post',
    data
  })
} 
