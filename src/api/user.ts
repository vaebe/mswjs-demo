import type { PaginationParameter, ResultData, ResultPageListData } from './base'
import Api from './base'

interface GetUserListParams extends PaginationParameter {
  nickName: string
  email: string
}

export interface UserInfo {
  id?: string
  email: string
  avatar: string
  nickName: string
  password?: string
  role: string
  accountType: string
  createdAt: string
  updatedAt: string
}

// 获取用户列表
export function getUserList(data: GetUserListParams): Promise<ResultPageListData<UserInfo[]>> {
  return Api.post('/user/getList', data)
}

// 保存用户信息
export function saveUserInfo(data: UserInfo): Promise<ResultData<{ id: string }>> {
  return Api.post('/user/create', data)
}

// 更新用户信息
export function updateUserInfo(data: UserInfo): Promise<ResultData<string>> {
  return Api.post('/user/update', data)
}

// 删除用户
export function removeUser(params: { id: string }): Promise<ResultData<string>> {
  return Api.delete(`/user/${params.id}`)
}

// 获取用户详情
export function getUserDetails(params: { id: string }): Promise<ResultData<UserInfo>> {
  return Api.get('/user/getUserInfo', { params })
}
