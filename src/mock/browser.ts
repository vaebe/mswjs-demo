import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
// import { getBasePath } from './utils'

export const worker = setupWorker(...handlers)

export function initMswWorker() {
  worker.start({
    onUnhandledRequest: 'bypass',
    // serviceWorker: {
    //   url: `${getBasePath()}/mockServiceWorker.js`,
    // },
  })
}
