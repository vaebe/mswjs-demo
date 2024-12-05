<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const { VITE_APP_TITLE } = import.meta.env
document.title = VITE_APP_TITLE

const Crud = defineAsyncComponent(() => import('@/components/Crud.vue'))
</script>

<template>
  <div>
    <Crud />
  </div>
</template>

<style scoped>
</style>
