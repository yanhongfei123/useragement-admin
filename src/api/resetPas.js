import request from '@/utils/request'

export function resetPas(data) {
  return request({
    url: '/api/resetPass',
    method: 'post',
    data
  })
}
