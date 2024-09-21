import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import commonjsExternals from 'vite-plugin-commonjs-externals'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { builtinModules } from 'module'

const externals = ['fix-path', 'electron-store', 'extract-zip',
  'hmc-win32', 'net-win32', ...builtinModules, ...builtinModules.map((m) => `node:${m}`)]

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    optimizeDeps: { exclude: externals },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      vue(),
      commonjsExternals({ externals }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false // css in js
          })
        ]
      })
    ]
  }
})
