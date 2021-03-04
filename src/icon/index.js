import Vue from 'vue'

import SvgIcon from './SvgIcon'
Vue.component('svg-icon', SvgIcon)

/* 解析./svg目录下的所有带svg后缀的文件
 * ./svg 之文件目录
 * false 表示不遍历子目录
 * /\.svg$/ 表示匹配文件后缀名为svg的文件
 *
 *
 */

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)
