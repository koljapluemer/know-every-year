import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useRouter } from 'vue-router'
// router

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const router = useRouter()

createApp(App).use(pinia).use(router).mount('#app')
