import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/profile',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
