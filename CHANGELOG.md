# 版本变化

## 1.0.1（2024-08-02）

### Features

* 引入polp做脚手架快速生成
* 升级eslint到最新版本
* 引入vite-plugin-vue-markdown 做文件渲染,方便后续首页等内容快速编写

## 1.0.2 (2024-08-02)

### Fix

- 升级依赖改为 unplugin-vue-markdown
- 并新增依赖 @unhead/vue 作为修改meta标题
  - ```
    ---
    title: 标题
    meat:
      - name: descript
        content: hello word
    ```
