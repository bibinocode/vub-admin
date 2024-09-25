import axios, { HttpStatusCode } from 'axios'
import type { AxiosInstance, AxiosPromise, AxiosResponse, AxiosError } from 'axios'
import JSONNbig from 'json-bigint'
import router from '@/router'
import type { ResponseDataType, ReuqestMethods } from './types'

/**
 * Axios实例处理
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  timeout: 30000,
  withCredentials: true, //跨域请求是否需要携带 cookie
  headers: {
    // Accept: 'application/json, text/plain, */*',
    // 'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8'
  },
  validateStatus: (status: HttpStatusCode) =>
    status === HttpStatusCode.Ok || status === HttpStatusCode.Unauthorized, // 放行状态200 和 401
  transformResponse: [
    (data) => (typeof data === 'string' ? JSONNbig({ storeAsString: true }).parse(data) : data)
  ]
})

/**
 * 拦截请求
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // token 处理 or 多租户处理 or 布局处理
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 登录无效函数
 */
const loginInvalid = () => {
  // 清除token
  // 销毁所有Dialog实例
  // 跳转页面
}

/**
 * 错误提示码对应错误信息
 */
export const errorMapTip = {
  [HttpStatusCode.Found]: '接口重定向了！',
  [HttpStatusCode.BadRequest]: '请求参数错误！',
  [HttpStatusCode.Unauthorized]: '登录已失效，请重新登录！',
  [HttpStatusCode.Forbidden]: '无访问权限！',
  [HttpStatusCode.NotFound]: `请求地址出错！`,
  [HttpStatusCode.RequestTimeout]: '请求超时！',
  [HttpStatusCode.Conflict]: '系统已存在相同数据！',
  [HttpStatusCode.InternalServerError]: '服务器内部错误！',
  [HttpStatusCode.NotImplemented]: '服务未实现！',
  [HttpStatusCode.BadGateway]: '网关错误！',
  [HttpStatusCode.ServiceUnavailable]: '服务不可用！',
  [HttpStatusCode.GatewayTimeout]: '服务暂时无法访问，请稍后再试！',
  [HttpStatusCode.HttpVersionNotSupported]: 'HTTP版本不支持！'
} as const

/**
 * 拦截响应
 */
axiosInstance.interceptors.response.use(
  <T = any>(response: AxiosResponse<ResponseDataType>): AxiosPromise<ResponseDataType<T>> => {
    const { data, status, headers } = response
    // 401 登录无效
    if (status == HttpStatusCode.Unauthorized) {
      loginInvalid()
      return Promise.reject(new Error('登录已失效，请重新登录！'))
    }
    // 接口登录生效 data.errcode 失效后 双TOKEN模式进行刷新headers['refreshedtoken'] != null 将token替换为刷新refreshedtoken
    if (!(data instanceof Blob) && !data.sucess) {
      return Promise.reject(new Error(data.errorMessage || 'error'))
    }
    return Promise.resolve(response)
  },
  (error: AxiosError) => {
    let message = '异常问题，请联系管理员！'
    if (error && error.response) {
      const status = error.response.status as HttpStatusCode
      // @ts-ignore
      if (errorMapTip[status]) {
        // @ts-ignore
        message = errorMapTip[status]
      }
    }
    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
