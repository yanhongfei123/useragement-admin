import request from '@/utils/request'

export function freezAcount(data) {
  return request({
    url: '/api/forbid',
    method: 'post',
    data
  })
}

export function setOrderStatus(data) {
  return request({
    url: '/api/admin/order',
    method: 'post',
    data
  })
}

export function getOrderlist(data) {
  return request({
    url: '/api/orderList',
    method: 'post',
    data
  })
}
