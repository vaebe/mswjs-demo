<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Crud = defineAsyncComponent(() => import('@/components/Crud.vue'))
</script>

<template>
  <div>
    <Crud />
  </div>
</template>

<style scoped>
</style>
