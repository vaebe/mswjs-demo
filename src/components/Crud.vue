<script setup lang="ts">
import type { UserInfo } from '@/api/user'
import { getUserList, addUser, removeUser, updateUser } from '@/api/user'
import { ref } from 'vue'
import { TinyNotify } from '@opentiny/vue'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

const userList = ref<Array<UserInfo>>([])

function queryUserList() {
  const opts = {
    nickName: '',
    email: '',
    pageSize: 10,
    pageNo: 1,
  }

  getUserList(opts).then((res) => {
    if (res.code === 0) {
      userList.value = res.data.list
      TinyNotify({ type: 'success', message: '获取成功！' })
    }
  })
}
queryUserList()

function createUser() {
  const code = uuidv4().replaceAll('-', '').substring(0, 8)

  const info = {
    email: `${code}@qq.com`,
    password: '123456',
    nickName: code,
    accountType: '01',
    role: '01',
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${code}&size=40`,
  }

  addUser(info).then((res) => {
    if (res.code === 0) {
      queryUserList()
      TinyNotify({ type: 'success', message: '新增成功！' })
    }
  })
}

function editUser(user: UserInfo) {
  const info = {
    ...user,
    nickName: uuidv4().replaceAll('-', '').substring(0, 8),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  updateUser(info).then((res) => {
    if (res.code === 0) {
      queryUserList()
      TinyNotify({ type: 'success', message: '编辑成功！' })
    }
  })
}

function delUser(id: string) {
  removeUser({ id }).then((res) => {
    if (res.code === 0) {
      queryUserList()
      TinyNotify({ type: 'success', message: '删除成功！' })
    }
  })
}

const toolbarButtons = ref([
  {
    code: 'getList',
    name: '查询'
  },
  {
    code: 'add',
    name: '新增'
  },
  {
    code: 'edit',
    name: '编辑'
  },
  {
    code: 'delete',
    name: '删除'
  },
])

function toolbarButtonClickEvent({ code, $grid }: { code: string, $grid: Record<string, any> }) {
  const data = $grid.getSelectRecords(true)

  switch (code) {
    case 'getList':
      queryUserList()
      break
    case 'add':
      createUser()
      break
    case 'edit': {
      if (data.length === 0) {
        TinyNotify({ type: 'warning', message: '请至少选中一条记录' })
      }

      if (data.length > 1) {
        TinyNotify({ type: 'warning', message: '每次只能编辑一条记录' })
      }

      editUser(data[0])

      $grid.removeSelecteds()
      break
    }
    case 'delete': {
      if (data.length === 0) {
        TinyNotify({ type: 'warning', message: '请至少选中一条记录' })
      }

      if (Array.isArray(data)) {
        data.forEach((item) => {
          delUser(item.id)
        })
      }

      $grid.removeSelecteds()
      break
    }
  }
}
</script>

<template>
  <div>
    <tiny-grid :data="userList" border @toolbar-button-click="toolbarButtonClickEvent">
      <template #toolbar>
        <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
      </template>
      <tiny-grid-column type="index" width="60"></tiny-grid-column>
      <tiny-grid-column type="selection" width="50"></tiny-grid-column>
      <tiny-grid-column field="nickName" title="昵称"></tiny-grid-column>
      <tiny-grid-column field="email" title="邮箱"></tiny-grid-column>
      <tiny-grid-column field="role" title="角色"></tiny-grid-column>
      <tiny-grid-column field="avatar" title="头像">
        <template #default="data">
          <tiny-image style="width: 60px;" :src="data.row.avatar"></tiny-image>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="accountType" title="账户类型"></tiny-grid-column>
      <tiny-grid-column field="createdAt" title="创建时间"></tiny-grid-column>
      <tiny-grid-column field="updatedAt" title="更新时间"></tiny-grid-column>
    </tiny-grid>
  </div>
</template>

<style scoped></style>
