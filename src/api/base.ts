import type { InternalAxiosRequestConfig } from 'axios'
import { TinyNotify } from '@opentiny/vue'
import axios from 'axios'
import { stringify } from 'qs'

// 分页参数
export interface PaginationParameter {
  pageSize: number
  pageNo: number
  total?: number
}

export interface ResultData<T> {
  code: number
  data: T
  msg: string
}

export interface ResultPageListData<T> {
  code: number
  data: {
    list: T
    pageNo: number
    pageSize: number
    total: number
  }
  msg: string
}

const { VITE_APP_AXIOS_TIMEOUT, VITE_APP_BASE_URL } = import.meta.env

// 创建axios实例
const service = axios.create({
  baseURL: VITE_APP_BASE_URL,
  paramsSerializer: (params) => {
    // get 请求添加时间戳  防止缓存
    params.client = 'web'
    params.timestamp = new Date().getTime()
    return stringify(params, { arrayFormat: 'brackets' })
  },
  timeout: Number.parseInt(VITE_APP_AXIOS_TIMEOUT),
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.authorization = 'test token'

    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (res.code === 401) {
      // const userStore = useUserStore()
      // userStore.loginOut()

      TinyNotify({
        type: 'warning',
        message: res.msg,
      })

      return Promise.reject(res)
    }

    if (res.code !== 0) {
      // 服务端返回错误提示就展示 否则展示
      const errorText
        = typeof res.msg === 'string'
          ? res.msg
          : Object.values(res.msg).join('\r\n')

      TinyNotify({
        type: 'error',
        message: errorText || '非常抱歉，遇到了一些错误！',
      })

      return Promise.reject(errorText || 'error')
    }

    return res
  },
  (error) => {
    // 后端请求 401 时仍返回 200 状态码，所以此处无需处理 401
    return Promise.reject(error)
  },
)

export default service
