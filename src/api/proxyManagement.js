import request from '@/utils/request'

export function getUseragentlist(data) {
  return request({
    url: '/api/useragent/list',
    method: 'post',
    data
  })
}

export function addUseragent(data) {
  return request({
    url: '/api/useragent/add',
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
