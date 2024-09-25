/// <reference types="vite/client" />

interface RecordAnyed<T = any> {
  [key: string]: T
}

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_SERVER_HOST: string
  readonly VITE_MOCK_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 提取值的联合类型
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never
