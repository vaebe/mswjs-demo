import { setupWorker } from 'msw/browser'
import { allHandlers } from './handlers'
import { getBasePath } from './utils'

export const worker = setupWorker(...allHandlers)

export function initMswWorker() {
  worker.start({
    /**
     * onUnhandledRequest 指定如何处理未匹配的请求
     * warn：打印警告但按原样执行请求。
     * error：打印错误并停止请求执行。
     * bypass：不打印任何内容，按原样执行请求。
     */
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      /**
       * 指定 `mockServiceWorker` 文件的路径，路径不正确请求会 405 错误
       * 因为这里最后需要把项目部署到 github pages 上 所以需要使用 `getBasePath`函数获取正确的路径
       */
      url: `${getBasePath()}/mockServiceWorker.js`,
    },
  })
}
