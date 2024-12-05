import { initMswWorker } from '@/mock'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

initMswWorker()
createApp(App).mount('#app')
