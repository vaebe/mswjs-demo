import { resolve } from 'node:path'
import autoImportPlugin from '@opentiny/unplugin-tiny-vue'
import importPlugin from '@opentiny/vue-vite-import'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/mswjs-demo/',
    plugins: [
      vue(),
      autoImportPlugin('vite'),
      importPlugin(
        [
          {
            libraryName: '@opentiny/vue',
          },
          {
            libraryName: `@opentiny/vue-icon`,
            customName: (name) => {
              return `@opentiny/vue-icon/lib/${name.replace(/^icon-/, '')}.js`
            },
          },
        ],
        'pc',
      ),
    ],
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    },
    define: {
      // eslint-disable-next-line node/prefer-global/process
      'process.env': { ...process.env, TINY_MODE: 'pc' },
    },
  }
})
