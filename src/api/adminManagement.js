import request from '@/utils/request'

export function getUserlist(data) {
  return request({
    url: '/api/userlist',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function addCount(data) {
  return request({
    url: '/api/money',
    method: 'post',
    data
  })
}
