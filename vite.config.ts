import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { createVitePlugin } from './.vite/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: createVitePlugin(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url))
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        /**
         * @description 自定义打包分包策略
         * @doc https://rollupjs.org/configuration-options/#output-manualchunks
         */
        manualChunks(id: string, { getModuleInfo }) {
          const isUtils = () => id.includes('src/utils')
          const isHooks = () => id.includes('src/hooks')
          const isModules = () => id.includes('node_modules')

          const index = id.includes('pnpm') ? 1 : 0 // 兼容pnpm 防止幽灵依赖打包过大

          const reg = /(.*)\/src\/components\/(.*)/
          if (reg.test(id)) {
            const importerLen = getModuleInfo(id)?.importers.length ?? 0
            // 多处引用
            if (importerLen > 1) return 'common'
          }

          if (isUtils()) return 'utils'
          if (isHooks()) return 'hooks'

          if (isModules()) {
            return id.toString().split('node_modules/')[1].split('/')[index].toString()
          }
          // 更细的分割策略
        },
        /** @description 资源文件 字体/图片等 */
        assetFileNames: '[ext]/[name]-[hash][extname]',
        /** @description 引入文件名的名称 */
        chunkFileNames: 'js/[name]-[hash].js',
        /**  @description 包的入口文件名称 */
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    /** @description 限制打包后的资源文件大小  */
    assetsInlineLimit: 2048
  },
  esbuild: {
    /** @description 移除 console 和 debugger */
    drop: ['console', 'debugger']
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    fs: {
      strict: false
    }
  },
  preview: {
    port: 5500
  }
})
