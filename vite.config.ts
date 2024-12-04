import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoImportPlugin from '@opentiny/unplugin-tiny-vue'
import importPlugin from '@opentiny/vue-vite-import'

export default defineConfig({
  plugins: [
    vue(),
    autoImportPlugin('vite'),
    importPlugin(
      [
        {
          libraryName: '@opentiny/vue'
        },
        {
          libraryName: `@opentiny/vue-icon`,
          customName: (name) => {
            return `@opentiny/vue-icon/lib/${name.replace(/^icon-/, '')}.js`
          }
        }
      ],
      'pc'
    )
  ],
  define: {
    'process.env': { ...process.env,TINY_MODE:'pc' }
  }
})
