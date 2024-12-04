import type { UserInfo } from '@/api/user'
import { http } from 'msw'
import { userList } from './data'
import { getApiUrl, sendJson } from './utils'

type RequireUserInfo = Required<UserInfo>

export const handlers = [
  // 获取用户列表
  http.post(getApiUrl('api/user/getList'), () => {
    const list: UserInfo[] = userList.map((user) => {
      return {
        ...user,
        password: '',
      }
    })

    const data = {
      list,
      pageNo: 1,
      pageSize: 10,
      total: list.length,
    }

    return sendJson(0, data)
  }),

  // 删除用户
  http.delete(getApiUrl('api/user/:id'), ({ params }) => {
    const { id } = params

    const user = userList.find(user => user.id === id)

    if (user) {
      return sendJson(0, null, `用户 ${user.nickName} 删除成功！`)
    }
    else {
      return sendJson(-1, null, '用户不存在！')
    }
  }),

  // 更新用户
  http.post<RequireUserInfo, UserInfo>(getApiUrl('api/user/update'), async ({ request }) => {
    const newUserInfo = await request.json() as UserInfo

    const user = userList.find(user => user.id === newUserInfo.id)

    if (user) {
      return sendJson(0, '', '更新成功！')
    }
    else {
      return sendJson(-1, null, 'User not found')
    }
  }),
]
