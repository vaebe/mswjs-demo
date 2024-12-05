<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { onBeforeUnmount, ref } from 'vue'

interface WsDataItem {
  uid: string
  name: string
  data: string
}

const dataList = ref<Array<WsDataItem>>([])

const { status, data, send, open, close } = useWebSocket('ws://wsChat', { onMessage: () => {
  if (data.value) {
    dataList.value.push(JSON.parse(data.value))
  }
} })
open()

const msgText = ref('')

const userId = uuidv4().replaceAll('-', '').substring(0, 6)
// 发送消息
function sendMsg() {
  const info = {
    uid: uuidv4(),
    name: `用户${userId}`,
    data: msgText.value,
  }

  // 将数据添加进列表
  dataList.value.push(info)

  // 发送消息
  send(JSON.stringify(info))

  // 发送消息后清空输入框
  msgText.value = ''
}

onBeforeUnmount(() => {
  close()
})
</script>

<template>
  <tiny-card title="模拟 WebSocket 请求" style="width: 100%;margin-top: 20px;" status="success">
    <p>状态： {{ status }}</p>

    <p style="margin: 10px 0;">
      数据:
    </p>

    <ul>
      <li v-for="item in dataList" :key="item.uid" style="margin-bottom: 8px;">
        {{ item.name }} : {{ item.data }}
      </li>
    </ul>

    <div style="display: flex;">
      <tiny-input v-model="msgText" placeholder="请输入要发送的消息" />
      <tiny-button @click="sendMsg">
        发送
      </tiny-button>
    </div>
  </tiny-card>
</template>

<style lang='scss' scoped></style>
