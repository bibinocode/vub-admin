import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

/**
 * 这里写自己定义路由的配置 不才用自动文件路由
 *
 */
const _routes: RouteRecordRaw[] = []

/**
 * 如果需要自动嵌套布局 将_routes 放到setupLayouts 中即可
 * 例如：
 * @example
 * ```ts
 * const routes = setupLayouts([...routes,..._routes])
 * ```
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [...setupLayouts(routes), ..._routes]
})

// 热更新
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
