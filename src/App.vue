<script setup lang="ts">
import type { UserInfo } from '@/api/user'
import { getUserList } from '@/api/user'
import { ref } from 'vue'

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
    }
  })
}
</script>

<template>
  <div>
    <tiny-button @click="queryUserList">
      获取用户列表
    </tiny-button>
    <tiny-alert description="TinyVue" />
  </div>
</template>

<style scoped>
</style>
