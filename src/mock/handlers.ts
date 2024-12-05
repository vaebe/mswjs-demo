import type { UserInfo } from '@/api/user'
import { http } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { db } from './database'
import { getApiUrl, paginate, sendJson } from './utils'

type RequireUserInfo = Required<UserInfo>

export const handlers = [
  // 获取用户列表
  http.post(getApiUrl('api/user/getList'), () => {
    const allList = db.user.getAll()

    const data = {
      list: paginate(allList),
      pageNo: 1,
      pageSize: 10,
      total: allList.length,
    }

    return sendJson(0, data)
  }),

  // 创建用户
  http.post(getApiUrl('api/user/create'), async ({ request }) => {
    const newUser = await request.json() as UserInfo

    const user = db.user.create({
      id: uuidv4(),
      ...newUser,
    })

    return sendJson(0, user)
  }),

  // 删除用户
  http.delete(getApiUrl('api/user/:id'), ({ params }) => {
    const { id } = params

    const user = db.user.delete({
      where: {
        id: { equals: id as string },
      },
    })

    if (user) {
      return sendJson(0, null, `用户 ${user.nickName} 删除成功！`)
    }
    else {
      return sendJson(-1, null, '用户不存在！')
    }
  }),

  // 更新用户
  http.post<RequireUserInfo, UserInfo>(getApiUrl('api/user/update'), async ({ request }) => {
    const newUser = await request.json() as UserInfo

    const updatedUser = db.user.update({
      where: { id: { equals: newUser.id } },
      data: newUser,
    })

    if (updatedUser) {
      return sendJson(0, updatedUser, '更新成功！')
    }
    else {
      return sendJson(-1, null, 'User not found')
    }
  }),
]
