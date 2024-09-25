import { Axios, Method, type AxiosRequestConfig } from 'axios'

/**
 * zh-CN: 请求方法类型
 * en-US: Request method type
 */
export type ReuqestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'
>

/**
 * 请求函数 request的参数
 */
export type RequestFnParams = {
  url: string
  method: ReuqestMethods
  params: RecordAnyed
  requestOption?: RequestOption
  axiosOption?: AxiosRequestConfig
}

/**
 * @param mock 是否启用Mock
 * @param showMask 是否显示遮罩层
 * @param showError 是否显示错误
 * @param throttleFlag 是否节流
 * @param throttleTimeout 节流限制时长
 */
export type RequestOption = {
  mock?: boolean
  showMask?: boolean
  showError?: boolean
  throttleFlag?: boolean
  throttleTimeout?: number
}

/**
 * zh-CN: 返回数据类型
 * en-US: Response data type
 */
export type ResponseDataType<T = any> = {
  errorCode: string | null
  data: T
  errorMessage: string | null
  sucess: boolean
}
