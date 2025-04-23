---
title: Vite Vue 打包配置一揽子计划
date: 2023-08-02 15:43:00
categories: 代码
---

## Vite Vue 打包配置一揽子计划

以下是关于 `vite.config.js` 的一些配置.

### 自动导入包(组件)

**引入**

需要引用 `unplugin-auto-import` 和 `unplugin-vue-components`.

```bash
npm install -D unplugin-auto-import unplugin-vue-components
```

**基础配置** 

```js
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      resolvers: [],
      dts: "./auto-import.d.ts",
    }),
    Components({
      // 按需加载组件
      dirs: ["src/components/auto"],
      resolvers: [],
    }),
  ]
})
```

**引入 `ElementPlus`**

安装: `npm install element-plus --save`

```js
// 1. 导入 ElementPlusResolver
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// 2. 添加至 `AutoImport` `Components` 的 resolvers 中
resolvers: [ElementPlusResolver()]
```

配置完成之后`Vue`页面可直接使用, 无需导入.

### 兼容较旧浏览器(IE除外)

**引入**

```bash
npm i -D @vitejs/plugin-legacy
```

**配置**

```js
import legacy from "@vitejs/plugin-legacy";

legacy({
    targets: ["defaults", "chrome 52"], //需要兼容的目标列表，可以设置多个
    additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    renderLegacyChunks: true,
    polyfills: [
    "es.symbol",
    "es.array.filter",
    "es.promise",
    "es.promise.finally",
    "es/map",
    "es/set",
    "es.array.for-each",
    "es.object.define-properties",
    "es.object.define-property",
    "es.object.get-own-property-descriptor",
    "es.object.get-own-property-descriptors",
    "es.object.keys",
    "es.object.to-string",
    "web.dom-collections.for-each",
    "esnext.global-this",
    "esnext.string.match-all",
    ],
}),
```

### BUILD

```js
build: {
    minify: "terser",
    outDir: "dist/",
    terserOptions: {
        compress: {
            //生产环境时移除console
            drop_console: true,
            drop_debugger: true,
        },
    },
},
```