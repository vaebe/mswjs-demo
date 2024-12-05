import type { UserInfo } from '@/api/user'
import { http } from 'msw'
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

export const allHandlers = [...userHandlers]
