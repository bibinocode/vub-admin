/**
 * Object 转 Query 字符串
 */
export function objectToQueryString(params: RecordAnyed | null) {
  if (params === null) {
    return null
  } else {
    return Object.keys(params)
      .map((key) => (key !== undefined ? `${key}=${params[key]}` : undefined))
      .filter((item) => item !== null)
      .join('&')
  }
}

export function getAppId() {
  const appId = sessionStorage.getItem('appId')
  return appId != null ? appId : undefined
}

export function setAppId(appId: string | null | undefined) {
  if (appId == null || appId == undefined || appId == '') {
    sessionStorage.removeItem('appId')
  } else {
    sessionStorage.setItem('appId', appId)
  }
}
