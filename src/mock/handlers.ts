import type { UserInfo } from '@/api/user'
import dayjs from 'dayjs'
import { http, ws } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { db } from './database'
import { getApiUrl, paginate, sendJson } from './utils'

export const userHandlers = [
  // 获取用户列表
  http.post(getApiUrl('api/user/getList'), () => {
    const allList = db.user.getAll()

    /**
     * paginate 函数需要传入一个数组，返回一个分页后的数组
     * 如果需要分页，需要在请求体中传入 pageNo 和 pageSize ，demo 就不做了
     */
    const data = {
      list: paginate(allList),
      pageNo: 1,
      pageSize: 10,
      total: allList.length,
    }

    // sendJson 统一返回数据格式的函数
    return sendJson(0, data)
  }),

  // 创建用户
  /**
   * <never, Omit<UserInfo, 'id'>> 表示：Params、RequestBodyType、ResponseBodyType、RequestPath 类型
   */
  http.post<never, Omit<UserInfo, 'id'>>(getApiUrl('api/user/create'), async ({ request }) => {
    const newUser = await request.json()

    // 向 user 表中添加一个用户数据
    const user = db.user.create({
      id: uuidv4(),
      ...newUser,
    })

    return sendJson(0, user)
  }),

  // 删除用户
  http.delete(getApiUrl('api/user/:id'), ({ params }) => {
    const { id } = params

    // 获取所有用户数据
    const userList = db.user.getAll()

    // 检查用户是否存在
    if (userList.some(item => item.id === id)) {
      // 根据 id 删除用户数据
      const user = db.user.delete({
        where: {
          id: { equals: id as string },
        },
      })

      return sendJson(0, null, `用户 ${user?.nickName} 删除成功！`)
    }
    else {
      return sendJson(-1, null, '用户不存在！')
    }
  }),

  // 更新用户
  http.post<never, UserInfo>(getApiUrl('api/user/update'), async ({ request }) => {
    const newUser = await request.json()

    // 获取所有用户数据
    const userList = db.user.getAll()

    // 检查用户是否存在
    if (userList.some(item => item.id === newUser.id)) {
      // 根据 id 更新用户数据
      const updatedUser = db.user.update({
        where: { id: { equals: newUser.id } },
        data: newUser,
      })

      return sendJson(0, updatedUser, '更新成功！')
    }
    else {
      return sendJson(-1, null, 'User not found')
    }
  }),
]

// ws = http wss = https
const wsChat = ws.link('ws://wsChat')

// 创建发送的 ws 消息
function createWsMsg(text?: string) {
  return JSON.stringify({
    uid: uuidv4(),
    name: `wsChat`,
    data: text ?? `这是 wsChat 返回的消息 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
  })
}

export const wsHandlers = [
  // 监听 ws 连接
  wsChat.addEventListener('connection', ({ client }) => {
    // 首次连接向客户端发送连接成功的消息
    client.send(createWsMsg('连接成功！'))

    // 监听客户端发送的消息
    client.addEventListener('message', (event) => {
      // 向客户端发送消息
      client.send(createWsMsg())

      // 除了发送数据的客户端,所有已连接的客户端都将接收到发送的数据
      wsChat.broadcastExcept(client, createWsMsg(`这是一条广播消息除了发送数据的客户端都会收到！${event.data}`))

      // 所有已连接的客户端都将接收到发送的数据
      wsChat.broadcast(createWsMsg('这是一条广播消息所有用户都会收到！'))

      console.warn('wsChat 收到的消息:', event.data)
    })

    // 监听客户端断开连接
    client.addEventListener('close', () => {
      wsChat.broadcast(createWsMsg(`客户端断开连接${client.id}`))
    })
  }),
]

export const allHandlers = [...userHandlers, ...wsHandlers]
