import { setupWorker } from 'msw/browser'
import { allHandlers } from './handlers'
import { getBasePath } from './utils'

export const worker = setupWorker(...allHandlers)

export function initMswWorker() {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${getBasePath()}/mockServiceWorker.js`,
    },
  })
}
