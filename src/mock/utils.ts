import { HttpResponse } from 'msw'

// 获取基础 path,需要部署到 github pages , mswjs-demo 仓库名
export function getBasePath() {
  return import.meta.env.PROD ? '/mswjs-demo' : ''
}

// 获取 api 的路径
export function getApiUrl(path: string) {
  return `${getBasePath()}/${path}`
}

// 返回的数据格式
export function sendJson(code: number, data: any, msg: string = '') {
  const info = { code, data, msg }
  return HttpResponse.json(info, { status: 200 })
}
