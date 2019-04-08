/*
 * 引用方法
 * import {urlJsonList} from '@utils'
 */
/**
 * el表单 验证数字>0
 * @param {*} rule
 * @param {验证的值} value
 * @param {回调} callback
 */
export function validateNumber(rule, value, callback) {
  if (value === 0 || value === '0') return callback()
  if (value === '' || value === null) return callback()
  if (value.length > 1 && Number(value) === 0) return callback(new Error('请输入大于0的数字'))
  if (value < 0 || Number(value) === 0) return callback(new Error('请输入大于0的数字'))
  if (!Number(value)) return callback(new Error('请输入大于0的数字'))
  callback()
}
/**
 * 对象转ulr&拼接
 * @param {拼接的对象} obj
 */
export function urlJsonList(obj) {
  return Object.keys(obj)
    .map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
    })
    .join('&')
}
/**
 * 删除提示框
 * @export
 * @param {vue} vue
 * @param {提示文字} text
 * @returns
 */
export function confirm(vue, text) {
  let _text = !text ? '此操作将永久删除该文件, 是否继续?' : text
  return new Promise((resolve, reject) => {
    vue.$confirm(_text, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resolve()
    }).catch(() => {
      reject(new Error('something bad happened'))
    })
  })
}
/**
 * @Created by xiandan on 2017-10-09
 * @desc 根据时间,格式 戳返回日期
 * @param { date } - 时间戳  @param { fmt }  - 格式格式
 * @return { fmt }
 * @dome01 DateFormat(1507513800642, 'yyyy/MM/dd hh:mm:ss')  => 2017/10/09 09:50:00
 * @dome02 DateFormat(1507513800642, 'yyyy-MM-dd hh:mm:ss')  => 2017-10-09 09:50:00
 * @dome03 DateFormat(1507513800642, 'yyyy.MM.dd , hh-mm-ss') => 2017.10.09 , 09-50-00
 */
export const DateFormat = (date, fmt) => {
  if (!(date && true)) {
    return date
  }
  date = new Date(parseInt(date))
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
// 导出记录
export const exportsOrder = (url, params) => {
  let base = window.BASEURL
  return `${base}${url}?` + params
}
// 验证是否为微信号
export const isWeChatNumber = (rule, value, callback) => {
  console.log(value, '验证是否为微信号')
  let reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
  if (value === '' || value === undefined) return callback(new Error('微信号不能为空'))
  if (!reg.test(value)) return callback(new Error('请输入正确微信号'))
  callback()
}
