import { defineConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import ViteComponents from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import * as path from 'path'
import { port } from './config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  // const { VITE_BASE_API_URL } = loadEnv(mode, __dirname)
  // const API_MAP = {
  //   development: '',
  //   production: '',
  //   test: '',
  //   uat: '',
  // }

  return {
    base: process.env.ELECTRON === 'true' ? './' : '',
    resolve: {
      //设置别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      exclude: ['electron'], // 告诉 Vite 排除预构建 electron，不然会出现 __diranme is not defined
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
        },
      },
    },
    plugins: [
      vue(),
      // 额外配置了手动引入修改主题色，在代码中不引入ElMessage直接使用的话tslint会报错，引入的话主题色又会被覆盖，只能再配置手动引入的
      ElementPlus({
        useSource: true,
      }),
      // 自动引入方法
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: ['vue'],
        dts: 'typings/auto-imports.d.ts',
        resolvers: [
          ElementPlusResolver({
            // 自动引入修改主题色添加这一行，使用预处理样式，不添加将会导致使用ElMessage，ElNotification等组件时默认的主题色会覆盖自定义的主题色
            importStyle: 'sass',
          }),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      // 自动引入组件
      ViteComponents({
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
        dirs: ['src/components'], // 按需加载的文件夹
        directoryAsNamespace: true,
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
          // 自动导入图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ], // ElementPlus按需加载
        dts: 'typings/components.d.ts',
      }),
      Icons({
        scale: 1,
        defaultClass: 'inline-block',
        autoInstall: true,
      }),
    ],
    server: {
      port: port, //启动端口
      host: '0.0.0.0', // windows server Network 添加此项
      hmr: true,
      // 设置开发环境代理
      proxy: {
        '/api': {
          target: '开发环境接口地址',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
