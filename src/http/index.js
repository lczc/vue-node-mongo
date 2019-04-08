'use strict'
import axios from 'axios'
import {
  Message
} from 'element-ui'
axios.defaults.timeout = 10000

// http request 拦截器
let loginToken = () => {
  return localStorage.getItem('loginToken')
}

axios.interceptors.request.use(
  request => {
    // 发送请求之前做一些处理
    request.headers.loginToken = loginToken()
    return request
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  res => {
    // 返回响应时做一些处理
    if (res.data.code === 1000) {
      // localStorage.setItem('loginToken', '')
      // window.location.reload()
    }
    return res
  },
  err => {
    return Promise.reject(err)
  }
)

let checkStatus = (res) => {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (res && (res.status === 200 || res.status === 304 || res.status === 400)) {
    return res
    // 如果不需要除了data之外的数据，可以直接 return res.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    errorMessage: res.data.errorMessage
  }
}

let checkCode = (res) => {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    Message.error({
      message: '网络错误'
    })
  }
  if (res.data && !res.data.success) {
    Message.error({
      message: res.data.errorMessage
    })
  }
  return res
}

// 设置缓存时间和缓存请求数组
let requestUrlPost = []
let requestUrlPut = []
let requestUrlDel = []
let requestUrlPatch = []
const SAVE_TIME = 1000

// 取消重复的请求
let requestUrlPost_ = []
let requestUrlPut_ = []
let requestUrlDel_ = []
let requestUrlPatch_ = []
let CancelToken = axios.CancelToken

// 获取当前时间戳
let getNowTime = () => {
  return new Date().getTime()
}
// 1秒内请求过滤方法
let requestUrlFilter = (urlArray) => {
  urlArray = urlArray.filter(item => {
    return item.setTime + SAVE_TIME > getNowTime()
  })
  return urlArray
}
// 重复请求过滤方法
let sessionUrlFilter = (urlArray, url) => {
  urlArray = urlArray.filter(item => {
    return item.url === url
  })
}
/** 通用 http 请求封装
 * @param {string} type 请求类型
 * @param {string} contentType 请求头参数
 * @param {array} urlArray 缓存请求数组
 * @param {array} urlArray_ 重复请求数组
 * @param {string} url 请求地址
 * @param {objece} params 请求头参数
 * @param {objece} data 请求体参数
 */

const httpRequest = async ({
  type,
  contentType = 'application/json; charset=UTF-8',
  urlArray = [],
  urlArray_ = [],
  url,
  params = '',
  data = ''
}) => {
  let source = CancelToken.source()
  urlArray = requestUrlFilter(urlArray)
  let sessionUrl = sessionUrlFilter(urlArray, url) || []
  if (sessionUrl.length > 0) {
    return new Promise(() => {})
  } else {
    let item = {
      url: url,
      setTime: getNowTime()
    }
    if (type !== 'get') {
      urlArray.push(item)
      if (urlArray_.length > 0) {
        source.cancel()
      } else {
        urlArray_.push(item)
      }
    }
    try {
      let res = await axios({
        method: type,
        url: url,
        params: params,
        data: data,
        timeout: 20000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': contentType
        },
        cancelToken: source.token
      })
      // urlArray_ = []
      // urlArray_ = [] 并没有作用到引用数组上，所以不行
      urlArray_.length = 0
      res = await checkStatus(res)
      res = await checkCode(res)
      return res
    } catch (err) {
      // 超时清空重复请求数组
      if (err.toString().indexOf('timeout')) {
        urlArray_.length = 0
      }
      Message.error({
        message: '网络错误'
      })
      return err
    }
  }
}

export default {
  get(url, params) {
    return httpRequest({
      type: 'get',
      params: params,
      url: url
    })
  },
  post(url, data) {
    return httpRequest({
      type: 'post',
      urlArray: requestUrlPost,
      urlArray_: requestUrlPost_,
      url: url,
      data: data
    })
  },
  put(url, data) {
    return httpRequest({
      type: 'put',
      urlArray: requestUrlPut,
      urlArray_: requestUrlPut_,
      url: url,
      data: data
    })
  },
  del(url, data) {
    return httpRequest({
      type: 'delete',
      urlArray: requestUrlDel,
      urlArray_: requestUrlDel_,
      url: url,
      data: data
    })
  },
  patch(url, data) {
    return httpRequest({
      type: 'patch',
      urlArray: requestUrlPatch,
      urlArray_: requestUrlPatch_,
      url: url,
      data: data
    })
  }
}
