import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetWind,
    transformerDirectives
} from 'unocss'

export default defineConfig({
    /** 自定义类组合 */
    shortcuts: [],
    /** 自定义属性 */
    rules: [],
    /** 预设 */
    presets: [
        presetWind(),
        presetAttributify(),
        presetIcons({
            prefix: 'icon',
            extraProperties: {
                display: 'inline-block' // 默认让其变成行内快
            }
        })
    ],
    transformers: [transformerDirectives()] // 启用--uno 或 @apply指令
})
