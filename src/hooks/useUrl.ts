import { objectToQueryString } from '@/common/utils'

/**
 * 转换URL HOOKS
 * @returns {buildGetUrl, requestUrl}
 *
 * Example:
 *
 * ```typescript
 * const { buildGetUrl, requestUrl } = useBuildUrl()
 * ```
 */
export const useBuildUrl = () => {
  /**
   * 构建GET请求的URL
   * @param actionName 请求的action名称
   * @param paranms 请求的参数
   * @returns {string} 请求的URL
   *
   * Example:
   *
   * ```typescript
   * const url = buildGetUrl('get-user', { id: 1 })
   * // url = 'http://localhost:3000/api/get-user?id=1'
   * ```
   */
  const buildGetUrl = (actionName: string, paranms: RecordAnyed | null = null) => {
    const queryStrig = objectToQueryString(paranms)
    if (actionName != null && actionName === '') {
      if (actionName.substring(0, 1) === '/') {
        actionName = actionName.substring(1)
      }
    }

    return (
      import.meta.env.VITE_SERVER_HOST + actionName + (queryStrig == null ? '' : '?' + queryStrig)
    )
  }

  /**
   * 构建请求的URL
   * @param actionName 请求的action名称
   * @returns {string} 请求的URL
   *
   * Example:
   *
   * ```typescript
   * const url = requestUrl('get-user')
   * // url = 'http://localhost:3000/api/get-user'
   * ```
   */
  const requestUrl = (actionName: string) => {
    if (actionName) {
      if (actionName.substring(0, 1) === '/') actionName = actionName.substring(1)
    }
    if (actionName.indexOf('https://') == 0 || actionName.indexOf('http://') === 0) {
      return actionName
    } else {
      return import.meta.env.VITE_SERVER_HOST + actionName
    }
  }

  return {
    buildGetUrl,
    requestUrl
  }
}
