/**
 *
 * @description 判断是否是移动端设备
 */
export function useAgent() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  )

  return {
    isMobile
  }
}
