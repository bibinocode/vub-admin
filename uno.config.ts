import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // 使用taiwindcss预设
    presetAttributify(),
    presetIcons({
      prefix: 'icon',
      extraProperties: {
        display: 'inline-block' // 默认让其变成行内快
      }
    })
  ]
})
