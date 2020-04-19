import Vue from 'vue'
import dayjs from 'dayjs'
// dayjs的相对时间插件
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
// 全局中文语言包
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

Vue.filter('timeFilter', function (value) {
  return dayjs().from(dayjs(value))
})
