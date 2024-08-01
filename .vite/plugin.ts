import { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCss from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Layouts from 'vite-plugin-vue-layouts'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import importToCDN from 'vite-plugin-cdn-import'
import { VitePWA } from 'vite-plugin-pwa'
/** @TODO:自定义CDN导入 */
const CDN_IMPORT_MAP = [{}]

export function createVitePlugin(): PluginOption[] {
  return [
    VueRouter(),
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx()
      }
    }),
    vueDevTools(),
    UnoCss(),
    Icons({
      compiler: 'vue3',
      autoInstall: true, // 自动安装图标集,
      customCollections: {
        // 自定义图标加载
        menu: FileSystemIconLoader('src/assets/icons/svg/menu', (svg) => {
          // 配合 currentColor 实现颜色切换
          return svg.replace(/^<svg/, '<svg fill="currentColor"')
        })
      }
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default'
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ['vue', VueRouterAutoImports, '@vueuse/core']
    }),
    Components({
      directoryAsNamespace: true, // 自动导入时，目录名作为命名空间
      collapseSamePrefixes: true, // 自动导入时，自动合并相同前缀的导入
      resolvers: [
        IconsResolver({
          prefix: 'icon', // 自定义前缀使用 {prefix}-{collection}-{icon}
          customCollections: ['menu'] // 自定义图标集合
        })
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate'
    })
  ]
}
