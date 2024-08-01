import type { RouteParams } from "vue-router";

/**
 * @description 获取带类型参数的响应式路由参数
 * @example
 * ```ts
 * const route = useParams<{id:string}>()
 * const id = route.value.id
 * ```
 */
export function useParams<P extends RouteParams>() {
	const route = useRoute()
	return computed(()=>route.params as P)
}
