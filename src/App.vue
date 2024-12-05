<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const { VITE_APP_TITLE } = import.meta.env
document.title = VITE_APP_TITLE

const Crud = defineAsyncComponent(() => import('@/components/Crud.vue'))
const Ws = defineAsyncComponent(() => import('@/components/Ws.vue'))
</script>

<template>
  <div>
    <Crud />
    <Ws />
  </div>
</template>

<style scoped>
</style>
