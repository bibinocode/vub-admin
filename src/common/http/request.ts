import AxiosInstance from './axios'
import { useBuildUrl } from '@/hooks/useUrl'
import type { RequestOption, ReuqestMethods, ResponseDataType, RequestFnParams } from './types'
import type { AxiosRequestConfig } from 'axios'
import { getAppId } from '../utils'

const { requestUrl } = useBuildUrl()

const globalConfig = {
  requestOption: {
    mock: false,
    showMask: false,
    showError: false,
    throttleFlag: false, // 节流开启 一个URl不能频繁调用
    throttleTimeout: 50 // 节流时间 50ms
  } as RequestOption,
  axiosOption: {
    responseType: 'json'
  } as AxiosRequestConfig
}

/**
 * 根据应用的 ID 状态选择合适的方式来展示错误消息。如果应用有效并且存在父窗口，则通过 postMessage 向父窗口发送错误消息；如果应用无效,则直接调用UI组件展示错误信息
 * @param message 错误信息
 */
function showErrorMessage(message: string | { showClose: boolean; message: string }) {
  const appId = getAppId()
  if (appId != null || appId != '') {
    if (window.parent) {
      window.parent.postMessage(
        {
          type: 'message',
          data: {
            type: 'error',
            text: message
          }
        },
        '*'
      )
    }
  } else {
    // 暂定 不确定用什么UI框架
    // ElMessage.error(message);
  }
}

/**
 * 遮罩层管理,多次调用支持引用计数
 * @example
 * ```typescript
 * const manager = new LoadingManager({ text: 'Loading...' })
 * manager.showMask() // 第一次调用，显示遮罩层
 * manager.showMask() // 引用计数 +1，不会重复显示
 * manager.hideMask() // 引用计数 -1，仍然显示遮罩层
 * manager.hideMask() // 引用计数为 0，关闭遮罩层
 * ```
 */
class LoadingManger {
  private refCount: number
  private options: RecordAnyed
  // loading:ReturnType<typeof ElLoading.service> | null; 根据UI框架决定
  private loading: any | null

  constructor(options: RecordAnyed) {
    this.options = options
    this.refCount = 0
    this.loading = null
  }

  showMask() {
    this.refCount++
    if (this.refCount <= 1 && this.loading == null) {
      // 创建弹窗服务 ElLoading.service(this.options)
      // this.loading =
    }
  }

  hideMask() {
    if (this.refCount <= 1 && this.loading != null) {
      this.loading.close()
      this.loading = null
    }
    this.refCount--
    this.refCount = Math.max(0, this.refCount)
  }
}

// 假设使用ElementPlus的UI组件库
const loadingManager = new LoadingManger({
  fullscreen: true,
  background: 'rgba(0, 0, 0, 0.1)'
})

/**
 * 节流的URL Set缓存
 */
const throlttleUrlSet = new Set<string>()

/**
 * 核心请求函数
 */
export async function request<T = any>({
  url,
  method = 'get',
  params,
  requestOption = {},
  axiosOption = {} // 允许为null
}: RequestFnParams): Promise<ResponseDataType<T>> {
  const finalOption = {
    ...globalConfig.requestOption,
    ...requestOption
  }

  const { showError, showMask, throttleFlag, throttleTimeout } = finalOption
  let finalUrl = url
  // Mock模式下,走mock前缀
  if (finalOption.mock) {
    finalUrl = import.meta.env.VITE_MOCK_HOST + finalUrl
  }
  if (throttleFlag && throlttleUrlSet.has(finalUrl)) {
    return Promise.reject(new Error('请求过于频繁，请稍后再试'))
  } else {
    if (throttleFlag) {
      throlttleUrlSet.add(finalUrl)
      setTimeout(() => throlttleUrlSet.delete(finalUrl), throttleTimeout || 50)
    }

    const finalAxiosnOption = {
      ...globalConfig.axiosOption,
      ...axiosOption
    }

    // GET OR POST
    let data: RecordAnyed = { params }
    if (method !== 'get') {
      data = {
        data: params
      }
    }

    if (showMask) {
      loadingManager.showMask()
    }

    try {
      const result: ResponseDataType<T> = await AxiosInstance({
        url: finalUrl,
        method,
        ...data,
        ...finalAxiosnOption
      })
      if (result instanceof Blob || result.sucess) {
        return Promise.resolve(result)
      } else {
        if (showError) {
          showErrorMessage({
            message: result.errorMessage ? result.errorMessage : '请求失败，请稍后再试',
            showClose: true
          })
        }
        return Promise.reject(result)
      }
    } catch (error) {
      console.warn('请求异常', error)
      if (showError) {
        const err = error as Error
        showErrorMessage({
          showClose: true,
          message: err ? err.message : '网络请求错误'
        })
      }
      return Promise.reject(error)
    } finally {
      loadingManager.hideMask()
    }
  }
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const get = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'get', requestOption: options, axiosOption })

/**
 * POST 请求
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const post = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'post', requestOption: options, axiosOption })

/**
 * PUT 请求
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const put = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'put', requestOption: options, axiosOption })

/**
 * PATCH 请求
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const patch = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'patch', requestOption: options, axiosOption })

/**
 * delete 请求
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const del = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'delete', requestOption: options, axiosOption })

/**
 * head 请求
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const head = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'head', requestOption: options, axiosOption })

/**
 * options 请求
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @param axiosOption
 * @returns
 */
export const options = async <T>(
  url: string,
  params: RecordAnyed,
  options?: RequestOption,
  axiosOption?: AxiosRequestConfig
) => await request<T>({ url, params, method: 'options', requestOption: options, axiosOption })

/**
 * 下载文件返回Bolb
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param method 请求方法
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 * @returns Blob
 */
export const downloadBolb = (
  url: string,
  params: RecordAnyed,
  method: ReuqestMethods = 'post',
  options?: RequestOption
) => {
  return new Promise<Blob>((resolve, reject) => {
    const axiosInstanceOption: AxiosRequestConfig = {
      responseType: 'blob',
      transformResponse: function (res) {
        return res instanceof Blob && res.size > 0 ? res : undefined
      }
    }
    request<Blob>({
      url: requestUrl(url),
      params,
      method,
      requestOption: options,
      axiosOption: axiosInstanceOption
    })
      .then((res) => {
        if (res instanceof Blob) {
          const blobData = new Blob([res.data], { type: 'application/octet-stream' })
          resolve(blobData)
        } else {
          console.warn('下载文件失败', res)
          reject(new Error('下载文件失败'))
        }
      })
      .catch((error) => {
        if (error instanceof Blob) {
          // 将文件内容读取到内存中以供处理的方式
          const reader = new FileReader()
          reader.onload = () => {
            reject(
              reader.result ? JSON.parse(reader.result.toString()).errorMessage : '下载文件失败'
            )
          }
          // 以文本格式读取文件内容
          reader.readAsText(error)
        } else {
          reject('下载文件失败')
        }
      })
  })
}

/**
 * 下载文件
 * @param url 请求地址
 * @param params 请求参数 data 请求体
 * @param fileName 下载文件名
 * @param method 请求方法
 * @param options 请求选项 (showMask-是否显示遮罩层,默认false, showError-是否显示错误信息,默认false, throttleFlag-是否开启节流,默认false, throttleTimeout-节流时间 默认50)
 */
export const download = async (
  url: string,
  params: RecordAnyed,
  fileName: string,
  method?: ReuqestMethods,
  options?: RequestOption
) => {
  return new Promise((resolve, reject) => {
    downloadBolb(url, params, method, options)
      .then((bolbData) => {
        const bolbUrl = window.URL.createObjectURL(bolbData as Blob)
        const linkDown = document.createElement('a')
        linkDown.href = bolbUrl
        linkDown.style.display = 'none'
        linkDown.setAttribute('download', fileName)
        if (typeof linkDown.download === 'undefined') {
          linkDown.setAttribute('target', '_blank')
        }
        document.body.appendChild(linkDown)
        linkDown.click()
        document.body.removeChild(linkDown)
        window.URL.revokeObjectURL(bolbUrl)
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * 上传
 */
export const upload = async (url: string, params: RecordAnyed, options?: RequestOption) => {
  const axiosinstanceOptions: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: [
      function (data) {
        const formData = new FormData()
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key])
        })
        return formData
      }
    ]
  }

  const finalOption = {
    ...globalConfig.requestOption,
    ...options
  }

  const { showError } = finalOption

  return new Promise((resolve, reject) => {
    request<RecordAnyed>({
      url: requestUrl(url),
      params,
      method: 'post',
      requestOption: options,
      axiosOption: axiosinstanceOptions
    })
      .then((res) => {
        if (res?.sucess) {
          resolve(res)
        } else {
          if (showError) {
            showErrorMessage({
              showClose: true,
              message: res.errorMessage ?? '数据请求失败'
            })
          }
          reject('数据请求失败')
        }
      })
      .catch((error) => {
        if (showError) {
          showErrorMessage({
            showClose: true,
            message: error.errorMessage ?? '数据请求失败'
          })
        }
        reject(error)
      })
  })
}

/**
 * 基础请求控制类
 * @example
 * ```typescript
 * class UserController extends BaseController {
 * 	static list(params: RecordAnyed,httpOptions?:RequestOption){
 * 		super.get('/user',params,httpOptions)
 * 	}
 * }
 * ```
 */
export class BaseController {
  static get = get
  static post = post
  static put = put
  static patch = patch
  static del = del
  static head = head
  static options = options
  static download = download
  static downloadBolb = downloadBolb
  static upload = upload
}
