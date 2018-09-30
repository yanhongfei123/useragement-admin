'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://easy-mock.com/mock/5ba90044a8066d21b71a471d/vue-admin"'
})
